import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { requireAuth } from '@/infra/http/auth-middleware'
import { createReviewRoute } from './create-review-route'
import { deleteReviewRoute } from './delete-review-route'
import { editReviewRoute } from './edit-review-route'
import { getPopularAlbumsRoute } from './get-popular-albums-route'
import { getReviewsByAlbumRoute } from './get-reviews-by-album-route'
import { getReviewsByUserRoute } from './get-reviews-by-user-route'
import { getTopAlbumsRoute } from './get-top-albums-route'

const authRoutes: FastifyPluginCallbackZod = (app) => {
  app.addHook('onRequest', requireAuth)

  app.register(createReviewRoute)
  app.register(deleteReviewRoute)
  app.register(editReviewRoute)
}

const publicRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(getReviewsByAlbumRoute)
  app.register(getReviewsByUserRoute)
  app.register(getPopularAlbumsRoute)
  app.register(getTopAlbumsRoute)
}

export const ratingRoutes: FastifyPluginCallbackZod = (app) => {
  app.register(authRoutes)
  app.register(publicRoutes)
}
