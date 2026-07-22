import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { searchAlbumsUseCase } from '../compose'

const okResponse = z.object({
  albums: zodAlbumDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

const querystring = z.object({
  artist: z.string().optional(),
  title: z.string().optional(),
  ...InfraSchemaUtils.paginationQuerystring.shape,
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

      const { artist, title } = query

      const result = await searchAlbumsUseCase.execute({
        artist,
        pagination,
        title,
      })

      return reply.status(HttpStatus.OK).send(result)
    }
  )
}
