import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authUserRoute } from './auth-user-route'
import { createUserRoute } from './create-user-route'

export const userRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createUserRoute)
  app.register(authUserRoute)
}
