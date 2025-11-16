import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { DomainError } from '@/contexts/common/domain-error'
import { createUserUseCase } from '@/infra/!ioc/user/use-cases'
import { errorResponse, HttpStatus } from '../http/http-status'
import { tags } from '../http/tags'
import { userResponse } from './schemas'

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: [tags.user],
        body: z.object({
          username: z.string(),
          password: z.string(),
        }),
        response: {
          [HttpStatus.CREATED]: userResponse,
          [HttpStatus.CONFLICT]: errorResponse,
          [HttpStatus.BAD_REQUEST]: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { body } = request

      const result = await createUserUseCase.execute(body)

      if (result.isOk) {
        return reply.code(201).send(result.value)
      }

      const code =
        result.error instanceof DomainError.Conflict
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST

      return reply.code(code).send(result.error)
    }
  )
}
