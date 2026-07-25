import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { FORMATS } from '@/contexts/catalog/domain/album'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodTopAlbumDTO } from '../../application/top-album-dto'
import { getTopAlbumsUseCase } from '../compose'

const querystring = z.object({
  format: z.enum(FORMATS).optional(),
  from: z.coerce.number().int().min(1900).max(2100).optional(),
  genre: z.string().optional(),
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
  to: z.coerce.number().int().min(1900).max(2100).optional(),
})

const okResponse = z.object({
  albums: zodTopAlbumDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const getTopAlbumsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/top',
    {
      schema: {
        querystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.rating],
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

      const result = await getTopAlbumsUseCase.execute({
        format: query.format,
        from: query.from,
        genre: query.genre,
        pagination: paginationResult.value,
        to: query.to,
      })

      return reply.status(HttpStatus.OK).send(result)
    }
  )
}
