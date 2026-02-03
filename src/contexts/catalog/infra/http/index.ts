import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { requireAuth } from '@/infra/http/auth-middleware'
import { albumSearchRoute } from './album-search-route'
import { createAlbumRoute } from './create-album-route'
import { genreSearchRoute } from './genre-search-routes'
import { getAlbumByPublicIdRoute } from './get-album-by-public-id'
import { getAlbumsRoute } from './get-albums-route'

const authRoutes: FastifyPluginCallbackZod = (app) => {
  app.addHook('onRequest', requireAuth)

  app.register(createAlbumRoute)
}

export const catalogRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(authRoutes)
  app.register(getAlbumsRoute)
  app.register(getAlbumByPublicIdRoute)
  app.register(albumSearchRoute)
  app.register(genreSearchRoute)
}
