import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authUserUseCase } from '@/infra/!ioc/user/use-cases'
import { errorResponse, HttpStatus } from '../http-status'
import { tags } from '../tags'

export const authUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        tags: [tags.user],
        body: z.object({
          username: z.string(),
          password: z.string(),
        }),
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
