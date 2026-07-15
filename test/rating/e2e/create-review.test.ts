import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createReviewViaHttp, setupUserAndAlbum } from './helpers'
import { RatingRoutes } from './routes'

describe('Create Review', () => {
  describe('POST /api/rating/review', () => {
    test('creates review and returns 200 with dto', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response } = await createReviewViaHttp(token, albumPublicId)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body).toHaveProperty('publicId')
      expect(body).toHaveProperty('rating')
      expect(body).toHaveProperty('albumTitle')
      expect(body).toHaveProperty('albumArtist')
      expect(body).toHaveProperty('isFavorite')
      expect(body).toHaveProperty('isEdited')
      expect(body).toHaveProperty('reviewedAt')
    })

    test('creates review with reviewText', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response } = await createReviewViaHttp(token, albumPublicId, {
        reviewText: 'Um álbum fantástico!',
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().reviewText).toBe('Um álbum fantástico!')
    })

    test('creates review without reviewText', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response } = await createReviewViaHttp(token, albumPublicId, {
        reviewText: undefined,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().reviewText).toBeNull()
    })

    test('creates review with isFavorite true', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response } = await createReviewViaHttp(token, albumPublicId, {
        isFavorite: true,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().isFavorite).toBeTruthy()
    })

    test('returns 409 for duplicate review', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId)
      const { response } = await createReviewViaHttp(token, albumPublicId)

      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    test('returns 404 for non-existent album', async () => {
      const { token } = await setupUserAndAlbum()
      const { response } = await createReviewViaHttp(
        token,
        'non-existent-public-id'
      )

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('returns 401 without auth token', async () => {
      const { albumPublicId } = await setupUserAndAlbum()
      const response = await app.inject({
        method: 'POST',
        payload: { albumPublicId, rating: 4 },
        url: RatingRoutes.POST.CREATE_REVIEW,
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })

    test('returns 400 for invalid rating', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const response = await app.inject({
        headers: { authorization: `Bearer ${token}` },
        method: 'POST',
        payload: { albumPublicId, rating: 3.7 },
        url: RatingRoutes.POST.CREATE_REVIEW,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty body', async () => {
      const { token } = await setupUserAndAlbum()
      const response = await app.inject({
        headers: { authorization: `Bearer ${token}` },
        method: 'POST',
        payload: {},
        url: RatingRoutes.POST.CREATE_REVIEW,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
