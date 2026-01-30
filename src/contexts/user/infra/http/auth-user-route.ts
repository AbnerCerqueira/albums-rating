import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authUserUseCase } from '@/contexts/user/infra/!ioc/use-cases'
import { errorResponse, HttpStatus } from '@/infra/http/http-status'
import { tags } from '@/infra/http/tags'
import { zodAuthUserUseCaseRequest } from '../../application/use-cases/auth-user-use-case'

export const authUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        tags: [tags.user],
        body: zodAuthUserUseCaseRequest,
        response: {
          [HttpStatus.OK]: z.object({ token: z.string() }),
          [HttpStatus.BAD_REQUEST]: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const result = await authUserUseCase.execute(request.body)

      if (!result.isOk) {
        return reply.code(HttpStatus.BAD_REQUEST).send(result.error)
      }

      const token = await reply.jwtSign(
        {},
        { sign: { sub: result.value.username, expiresIn: '1d' } }
      )

      return reply.send({ token })
    }
  )
}
