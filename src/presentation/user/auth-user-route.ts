import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import type { AuthUserUseCaseInput } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { authUserUseCase } from '@/infra/!ioc/user/use-cases'
import { errorResponse, HttpStatus } from '../http-status'
import { tags } from '../tags'

const body = z.object({
  email: z.email(),
  password: z.string(),
}) satisfies z.ZodType<AuthUserUseCaseInput>

export const authUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        tags: [tags.user],
        body,
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
