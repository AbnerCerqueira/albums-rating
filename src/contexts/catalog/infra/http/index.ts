import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createAlbumRoute } from './create-album-route'
import { genreSearchRoute } from './genre-search-routes'
import { getAlbumByPublicIdRoute } from './get-album-by-public-id'
import { getAlbumsRoute } from './get-albums-route'

export const catalogRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(createAlbumRoute)
  app.register(getAlbumsRoute)
  app.register(getAlbumByPublicIdRoute)
  app.register(genreSearchRoute)
}
