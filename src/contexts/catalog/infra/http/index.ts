import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { requireAuth } from '@/infra/http/auth-middleware'
import { createAlbumRoute } from './create-album-route'
import { createGenreRoute } from './create-genre-route'
import { getAlbumByPublicIdRoute } from './get-album-by-public-id'
import { getAlbumsRoute } from './get-albums-route'
import { searchAlbumRoute } from './search-album-route'
import { searchGenreRoute } from './search-genre-routes'
import { uploadAlbumCoverRoute } from './upload-album-cover-route'

const authRoutes: FastifyPluginCallbackZod = (app) => {
  app.addHook('onRequest', requireAuth)

  app.register(createAlbumRoute)
  app.register(createGenreRoute)
  app.register(uploadAlbumCoverRoute)
}

export const catalogRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(authRoutes)
  app.register(getAlbumsRoute)
  app.register(getAlbumByPublicIdRoute)
  app.register(searchAlbumRoute)
  app.register(searchGenreRoute)
}
