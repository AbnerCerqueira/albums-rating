import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { catalogRoutes } from '@/contexts/catalog/infra/http'
import { userRoutes } from '@/contexts/user/infra/http'
import { HttpStatus } from './http-status'
import { tags } from './tags'

export const routes: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/',
    {
      schema: {
        response: { [HttpStatus.OK]: z.object({ message: z.string() }) },
        tags: [tags.healthCheck],
      },
    },
    () => ({
      message: 'OK',
    })
  )
  app.register(userRoutes, { prefix: '/user' })
  app.register(catalogRoutes, { prefix: '/catalog' })
}
