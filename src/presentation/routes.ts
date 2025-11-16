import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HttpStatus } from './http-status'
import { tags } from './tags'
import { userRoutes } from './user/routes'

export const routes: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/',
    {
      schema: {
        tags: [tags.healthCheck],
        response: { [HttpStatus.OK]: z.object({ message: z.string() }) },
      },
    },
    () => ({
      message: 'OK',
    })
  )
  app.register(userRoutes, { prefix: '/user' })
}
