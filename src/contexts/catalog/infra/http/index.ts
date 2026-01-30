import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createAlbumRoute } from './create-album-route'

export const catalogRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createAlbumRoute)
}
