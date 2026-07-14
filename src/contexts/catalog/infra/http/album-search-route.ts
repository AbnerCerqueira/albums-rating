import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { unwrap } from '@/contexts/!common/result'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { AlbumDTOMapper, zodAlbumDTO } from '../../application/album-dto'
import { FORMATS, type Format } from '../../domain/album'
import { albumRepository } from '../!ioc/repositories'

const okResponse = z.object({
  albums: zodAlbumDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const zodFormatSchema = z.enum(FORMATS)

function normalizeFormatQuery(val: unknown): Format[] | undefined {
  if (val === undefined || val === '') {
    return
  }
  if (Array.isArray(val)) {
    return val as Format[]
  }
  return [val] as Format[]
}

const querystring = z.object({
  artist: z.string().optional(),
  format: z
    .preprocess(normalizeFormatQuery, zodFormatSchema.array())
    .optional(),
  genre: z.string().optional(),
  title: z.string().optional(),
  ...InfraSchemaUtils.searchStringOptionsQuerystring.shape,
})

export const albumSearchRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/search',
    {
      schema: {
        querystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const { query } = request

      const [pagination, paginationErr] = unwrap(
        InfraSchemaUtils.validatePagination(query)
      )
      if (paginationErr) {
        return reply.status(HttpStatus.BAD_REQUEST).send(paginationErr)
      }

      const albums = await albumRepository.searchString(
        query,
        pagination,
        query
      )

      return reply.status(HttpStatus.OK).send({
        albums: albums.map((a) => AlbumDTOMapper.toDTO(a)),
        currentPage: pagination?.page,
        size: pagination?.size,
      })
    }
  )
}
