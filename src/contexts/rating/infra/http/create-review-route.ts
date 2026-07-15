import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { ConflictError, NotFoundError } from '@/contexts/!common/errors'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodCreateReviewUseCaseRequest } from '../../application/create-review-use-case'
import { zodReviewDTO } from '../../application/review-dto'
import { createReviewUseCase } from '../compose'

export const createReviewRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/review',
    {
      schema: {
        body: zodCreateReviewUseCaseRequest,
        response: {
          [HttpStatus.OK]: zodReviewDTO,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.CONFLICT]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.rating],
      },
    },
    async (request, reply) => {
      const result = await createReviewUseCase.execute(
        request.body,
        request.user.sub
      )

      if (result.ok) {
        return reply.send(result.value)
      }

      if (result.error instanceof NotFoundError) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: result.error.message })
      }

      if (result.error instanceof ConflictError) {
        return reply
          .status(HttpStatus.CONFLICT)
          .send({ message: result.error.message })
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: result.error.message })
    }
  )
}
