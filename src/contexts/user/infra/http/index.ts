import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authUserRoute } from '@/contexts/user/infra/http/auth-user-route'
import { createUserRoute } from '@/contexts/user/infra/http/create-user-route'

export const userRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createUserRoute)
  app.register(authUserRoute)
}
