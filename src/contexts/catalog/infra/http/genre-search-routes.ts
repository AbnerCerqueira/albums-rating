import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { unwrap } from '@/contexts/!common/result'
import { defaultSearchStringOptions } from '@/contexts/!common/search-options'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { albumRepository } from '../!ioc/repositories'

const okResponse = z.object({
  genres: z.string().array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

const querystring = z.object({
  genre: z.string().optional(),
  ...InfraSchemaUtils.searchStringOptionsQuerystring.omit({ combineWith: true })
    .shape,
})

export const genreSearchRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/available-genres',
    {
      schema: {
        tags: [tags.catalog],
        querystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: InfraSchemaUtils.errorResponse,
        },
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
        { genre: query.genre },
        pagination,
        { ...defaultSearchStringOptions, ...query }
      )

      return reply.status(HttpStatus.OK).send({
        currentPage: pagination?.page,
        size: pagination?.size,
        genres: albums.map((a) => a.props.genre),
      })
    }
  )
}
