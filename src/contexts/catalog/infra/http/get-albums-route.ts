import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { unwrap } from '@/contexts/!common/result'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { AlbumDTOMapper, zodAlbumDTO } from '../../application/album-dto'
import { albumRepository } from '../!ioc/repositories'

const okResponse = z.object({
  albums: zodAlbumDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const getAlbumsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '',
    {
      schema: {
        querystring: InfraSchemaUtils.paginationQuerystring,
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

      const albums = await albumRepository.find(pagination)

      return reply.status(HttpStatus.OK).send({
        albums: albums.map((a) => AlbumDTOMapper.toDTO(a)),
        currentPage: pagination?.page,
        size: pagination?.size,
      })
    }
  )
}
