import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { zodAuthUserUseCaseRequest } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { authUserUseCase } from '@/contexts/user/infra/compose'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'

export const authUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        body: zodAuthUserUseCaseRequest,
        response: {
          [HttpStatus.OK]: z.object({ token: z.string() }),
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.user],
      },
    },
    async (request, reply) => {
      const result = await authUserUseCase.execute(request.body)

      if (!result.ok) {
        return reply
          .code(HttpStatus.BAD_REQUEST)
          .send({ message: result.error.message })
      }

      const token = await reply.jwtSign(
        {},
        { sign: { expiresIn: '1d', sub: result.value.username } }
      )

      return reply.send({ token })
    }
  )
}
