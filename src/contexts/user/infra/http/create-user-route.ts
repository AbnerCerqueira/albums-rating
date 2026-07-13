import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { ConflictError } from '@/contexts/!common/errors'
import { zodCreateUserUseCaseRequest } from '@/contexts/user/application/use-cases/create-user-use-case'
import { zodUserDTO } from '@/contexts/user/application/user-dto'
import { createUserUseCase } from '@/contexts/user/infra/compose'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '',
    {
      schema: {
        body: zodCreateUserUseCaseRequest,
        response: {
          [HttpStatus.CREATED]: zodUserDTO,
          [HttpStatus.CONFLICT]: InfraSchemaUtils.errorResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.user],
      },
    },
    async (request, reply) => {
      const result = await createUserUseCase.execute(request.body)
      if (result.ok) {
        return reply.code(201).send(result.value)
      }
      const code =
        result.error instanceof ConflictError
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST
      return reply.code(code).send({ message: result.error.message })
    }
  )
}
