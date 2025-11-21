import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { DomainError } from '@/contexts/common/domain-error'
import type { CreateUserUseCaseInput } from '@/contexts/user/application/use-cases/create-user-use-case'
import { createUserUseCase } from '@/infra/!ioc/user/use-cases'
import { errorResponse, HttpStatus } from '../http-status'
import { tags } from '../tags'
import { userResponse } from './schemas'

const body = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
}) satisfies z.ZodType<CreateUserUseCaseInput>

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: [tags.user],
        body,
        response: {
          [HttpStatus.CREATED]: userResponse,
          [HttpStatus.CONFLICT]: errorResponse,
          [HttpStatus.BAD_REQUEST]: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const result = await createUserUseCase.execute(request.body)

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
