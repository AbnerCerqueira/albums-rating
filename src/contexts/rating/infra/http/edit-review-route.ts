import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ForbiddenError, NotFoundError } from '@/contexts/!common/errors'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodEditReviewUseCaseRequest } from '../../application/edit-review-use-case'
import { zodReviewDTO } from '../../application/review-dto'
import { editReviewUseCase } from '../compose'

const params = z.object({
  publicId: z.string(),
})

export const editReviewRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/review/:publicId',
    {
      schema: {
        body: zodEditReviewUseCaseRequest,
        params,
        response: {
          [HttpStatus.OK]: zodReviewDTO,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.FORBIDDEN]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.rating],
      },
    },
    async (request, reply) => {
      const result = await editReviewUseCase.execute(
        request.body,
        request.params.publicId,
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

      if (result.error instanceof ForbiddenError) {
        return reply
          .status(HttpStatus.FORBIDDEN)
          .send({ message: result.error.message })
      }

      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: result.error.message })
    }
  )
}
