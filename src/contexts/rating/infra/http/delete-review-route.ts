import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { NotFoundError } from '@/contexts/!common/errors'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { deleteReviewUseCase } from '../compose'

const params = z.object({
  publicId: z.string(),
})

export const deleteReviewRoute: FastifyPluginCallbackZod = (app) => {
  app.delete(
    '/review/:publicId',
    {
      schema: {
        params,
        response: {
          [HttpStatus.FORBIDDEN]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NO_CONTENT]: z.undefined(),
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.rating],
      },
    },
    async (request, reply) => {
      const result = await deleteReviewUseCase.execute(
        request.params.publicId,
        request.user.sub
      )

      if (result.ok) {
        return reply.status(HttpStatus.NO_CONTENT).send()
      }

      if (result.error instanceof NotFoundError) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: result.error.message })
      }

      return reply
        .status(HttpStatus.FORBIDDEN)
        .send({ message: result.error.message })
    }
  )
}
