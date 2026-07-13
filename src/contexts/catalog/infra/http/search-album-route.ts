import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { FORMATS, type Format } from '../../domain/album'
import { searchAlbumsUseCase } from '../compose'

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
  ...InfraSchemaUtils.searchOptionsQuerystring.shape,
})

export const searchAlbumRoute: FastifyPluginCallbackZod = (app) => {
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

      const paginationResult = Pagination.create(query.page, query.size)
      if (!paginationResult.ok) {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: paginationResult.error.message })
      }

      const pagination = paginationResult.value

      const { artist, genre, title, format, matchType, combineWith } = query

      const result = await searchAlbumsUseCase.execute({
        artist,
        combineWith,
        format,
        genre,
        matchType,
        pagination,
        title,
      })

      return reply.status(HttpStatus.OK).send(result)
    }
  )
}
