import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import {
  createReviewViaHttp,
  getReviewsByAlbumViaHttp,
  setupUserAndAlbum,
} from './helpers'

describe('Get Reviews By Album', () => {
  describe('GET /api/rating/album/:publicId', () => {
    test('returns reviews for a valid album', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId, { rating: 4.5 })

      const { response } = await getReviewsByAlbumViaHttp(albumPublicId)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{
        reviews: Record<string, unknown>[]
        currentPage?: number
        size?: number
        total?: number
        totalPages?: number
      }>()
      expect(body.reviews).toBeInstanceOf(Array)
      expect(body.reviews.length).toBeGreaterThanOrEqual(1)
      expect(body.reviews[0]).toHaveProperty('publicId')
      expect(body.reviews[0]).toHaveProperty('rating')
      expect(body.reviews[0]).toHaveProperty('albumTitle')
      expect(body.reviews[0]).toHaveProperty('albumArtist')
      expect(body.reviews[0]).toHaveProperty('isFavorite')
      expect(body.reviews[0]).toHaveProperty('isEdited')
      expect(body.reviews[0]).toHaveProperty('reviewedAt')
      expect(body.reviews[0]).toHaveProperty('username')
    })

    test('returns reviews from multiple users', async () => {
      const { albumPublicId } = await setupUserAndAlbum()

      const user1 = await setupUserAndAlbum()
      await createReviewViaHttp(user1.token, albumPublicId, { rating: 5 })

      const user2 = await setupUserAndAlbum()
      await createReviewViaHttp(user2.token, albumPublicId, { rating: 3 })

      const { response } = await getReviewsByAlbumViaHttp(albumPublicId)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ reviews: unknown[] }>()
      expect(body.reviews.length).toBe(2)
    })

    test('returns empty array for album with no reviews', async () => {
      const { albumPublicId } = await setupUserAndAlbum()

      const { response } = await getReviewsByAlbumViaHttp(albumPublicId)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ reviews: unknown[] }>()
      expect(body.reviews).toEqual([])
    })

    test('returns 404 for non-existent album', async () => {
      const { response } = await getReviewsByAlbumViaHttp('nao-existe-album')

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('supports pagination', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId, { rating: 4 })

      const { response } = await getReviewsByAlbumViaHttp(albumPublicId, {
        page: 1,
        size: 10,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{
        reviews: unknown[]
        currentPage?: number
        size?: number
        total?: number
        totalPages?: number
      }>()
      expect(body.currentPage).toBe(1)
      expect(body.size).toBe(10)
      expect(body.total).toBe(1)
      expect(body.totalPages).toBe(1)
    })

    test('returns 400 for invalid pagination', async () => {
      const { albumPublicId } = await setupUserAndAlbum()

      const response = await app.inject({
        method: 'GET',
        url: `/api/rating/album/${albumPublicId}?page=-1&size=-1`,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
