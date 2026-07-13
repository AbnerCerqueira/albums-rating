import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { searchGenresUseCase } from '../compose'

const okResponse = z.object({
  genres: z.string().array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

const querystring = z.object({
  genre: z.string().optional(),
  ...InfraSchemaUtils.searchOptionsQuerystring.omit({ combineWith: true })
    .shape,
})

export const searchGenreRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/search/available-genres',
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

      const result = await searchGenresUseCase.execute({
        genre: query.genre,
        matchType: query.matchType,
        pagination,
      })

      return reply.status(HttpStatus.OK).send(result)
    }
  )
}
