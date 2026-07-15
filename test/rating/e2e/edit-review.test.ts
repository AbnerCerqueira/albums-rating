import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import {
  createReviewViaHttp,
  editReviewViaHttp,
  setupUserAndAlbum,
} from './helpers'
import { RatingRoutes } from './routes'

describe('Edit Review', () => {
  describe('PATCH /api/rating/review/:publicId', () => {
    test('edits review rating and returns 200 with dto', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId,
        { rating: 3 }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await editReviewViaHttp(token, reviewPublicId, {
        rating: 5,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().rating).toBe(5)
    })

    test('edits review text and sets isEdited to true', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId,
        { reviewText: 'Texto original' }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await editReviewViaHttp(token, reviewPublicId, {
        reviewText: 'Texto editado',
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().reviewText).toBe('Texto editado')
      expect(response.json().isEdited).toBeTruthy()
    })

    test('edits review isFavorite', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId,
        { isFavorite: false }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await editReviewViaHttp(token, reviewPublicId, {
        isFavorite: true,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().isFavorite).toBeTruthy()
    })

    test('clears reviewText when sending null', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId,
        { reviewText: 'Texto para apagar' }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const response = await app.inject({
        headers: { authorization: `Bearer ${token}` },
        method: 'PATCH',
        payload: { reviewText: null },
        url: RatingRoutes.PATCH.EDIT_REVIEW(reviewPublicId),
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().reviewText).toBeNull()
      expect(response.json().isEdited).toBeTruthy()
    })

    test('does not change reviewText when omitted', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId,
        { reviewText: 'Texto original' }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await editReviewViaHttp(token, reviewPublicId, {
        rating: 5,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.json().reviewText).toBe('Texto original')
    })

    test('returns 404 for non-existent review', async () => {
      const { token } = await setupUserAndAlbum()
      const { response } = await editReviewViaHttp(
        token,
        'non-existent-public-id',
        { rating: 5 }
      )

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('returns 403 when editing review from another user', async () => {
      const { albumPublicId } = await setupUserAndAlbum()

      const user1 = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        user1.token,
        albumPublicId,
        { rating: 3 }
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const user2 = await setupUserAndAlbum()
      const { response } = await editReviewViaHttp(
        user2.token,
        reviewPublicId,
        { rating: 5 }
      )

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
    })

    test('returns 401 without auth token', async () => {
      const response = await app.inject({
        method: 'PATCH',
        payload: { rating: 5 },
        url: RatingRoutes.PATCH.EDIT_REVIEW('some-public-id'),
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })

    test('returns 400 for invalid rating', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      const { response: createResponse } = await createReviewViaHttp(
        token,
        albumPublicId
      )
      const reviewPublicId = createResponse.json<{ publicId: string }>()
        .publicId

      const { response } = await editReviewViaHttp(token, reviewPublicId, {
        rating: 3.7,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
