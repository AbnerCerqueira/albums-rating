import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createAlbumRoute } from './create-album-route'
import { getAlbumsRoute } from './get-albums-route'

export const catalogRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createAlbumRoute)
  app.register(getAlbumsRoute)
}
