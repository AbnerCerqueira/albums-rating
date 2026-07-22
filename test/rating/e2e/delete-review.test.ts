import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import {
  createReviewViaHttp,
  deleteReviewViaHttp,
  getReviewsByAlbumViaHttp,
  setupUserAndAlbum,
} from './helpers'
import { RatingRoutes } from './routes'

describe('Delete Review', () => {
  describe('DELETE /api/rating/review/:publicId', () => {
    test('deletes review and returns 204', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await deleteReviewViaHttp(token, reviewPublicId)

      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

      const { response: getResponse } =
        await getReviewsByAlbumViaHttp(albumPublicId)
      expect(getResponse.json<{ reviews: unknown[] }>().reviews).toEqual([])
    })

    test('returns 404 for non-existent review', async () => {
      const { token } = await setupUserAndAlbum()
      const { response } = await deleteReviewViaHttp(
        token,
        'non-existent-public-id'
      )

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('returns 403 when deleting review from another user', async () => {
      const { albumPublicId } = await setupUserAndAlbum()

      const user1 = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        user1.token,
        albumPublicId
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const user2 = await setupUserAndAlbum()
      const { response } = await deleteReviewViaHttp(
        user2.token,
        reviewPublicId
      )

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
    })

    test('returns 401 without auth token', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: RatingRoutes.DELETE.REVIEW('some-public-id'),
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })
  })
})
