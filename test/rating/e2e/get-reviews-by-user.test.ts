import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createUserViaHttp } from '../../user/e2e/helpers'
import {
  createReviewViaHttp,
  getReviewsByUserViaHttp,
  setupUserAndAlbum,
} from './helpers'

describe('Get Reviews By User', () => {
  describe('GET /api/rating/review/user/:username', () => {
    test('returns reviews for a valid user', async () => {
      const { token, user, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId, { rating: 4.5 })

      const { response } = await getReviewsByUserViaHttp(user.username)

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
    })

    test('returns empty array for user with no reviews', async () => {
      const { payload } = await createUserViaHttp()

      const { response } = await getReviewsByUserViaHttp(payload.username)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ reviews: unknown[] }>()
      expect(body.reviews).toEqual([])
    })

    test('returns 404 for non-existent username', async () => {
      const { response } = await getReviewsByUserViaHttp('non-existent-user')

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('supports pagination', async () => {
      const { payload } = await createUserViaHttp()

      const { response } = await getReviewsByUserViaHttp(payload.username, {
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
      expect(body.total).toBe(0)
      expect(body.totalPages).toBe(0)
    })

    test('returns 400 for invalid pagination', async () => {
      const { payload } = await createUserViaHttp()

      const response = await app.inject({
        method: 'GET',
        url: `/api/rating/user/${payload.username}?page=-1&size=-1`,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
