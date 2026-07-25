import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { PublicId } from '@/contexts/!common/public-id'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodReviewDTO } from '../../application/review-dto'
import { getReviewsByAlbumUseCase } from '../compose'

const params = z.object({
  publicId: z.string(),
})

const okResponse = z.object({
  reviews: zodReviewDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const getReviewsByAlbumRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/album/:publicId',
    {
      schema: {
        params,
        querystring: InfraSchemaUtils.paginationQuerystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
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

      const result = await getReviewsByAlbumUseCase.execute({
        albumPublicId: PublicId.unsafe(request.params.publicId),
        pagination: paginationResult.value,
      })

      if (!result.ok) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: result.error.message })
      }

      return reply.status(HttpStatus.OK).send(result.value)
    }
  )
}
