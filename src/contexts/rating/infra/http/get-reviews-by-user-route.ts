import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { ReviewDTOMapper, zodReviewDTO } from '../../application/review-dto'
import { reviewGateway, reviewRepository } from '../compose'

const params = z.object({
  username: z.string(),
})

const okResponse = z.object({
  reviews: zodReviewDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const getReviewsByUserRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/user/:username',
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
      const { username } = request.params
      const { query } = request

      const paginationResult = Pagination.create(query.page, query.size)
      if (!paginationResult.ok) {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: paginationResult.error.message })
      }

      const userResult = await reviewGateway.findUserByUsername(username)
      if (!userResult.ok) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: userResult.error.message })
      }

      const result = await reviewRepository.findByUser(
        userResult.value.id,
        paginationResult.value
      )

      return reply.status(HttpStatus.OK).send({
        currentPage: result.currentPage,
        reviews: result.items.map((r) => ReviewDTOMapper.toDTO(r)),
        size: result.size,
        total: result.total,
        totalPages: result.totalPages,
      })
    }
  )
}
