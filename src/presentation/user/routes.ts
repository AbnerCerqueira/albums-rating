import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createUserRoute } from './create-user-route'

export const userRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createUserRoute)
}
