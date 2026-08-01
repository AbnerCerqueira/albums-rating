import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import {
  type AlbumPayload,
  createAlbumPayload,
  createAlbumViaHttp,
  createUserAndLogin,
} from './helpers'

describe('Create Album', () => {
  describe('POST /api/catalog', () => {
    test('creates album and returns 201 with dto', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token)

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      const body = response.json<
        AlbumPayload & { reviewCount: number; agerageRating: number }
      >()
      expect(body).toHaveProperty('artist')
      expect(body).toHaveProperty('coverUrl')
      expect(body).toHaveProperty('format')
      expect(body).toHaveProperty('genres')
      expect(body).toHaveProperty('publicId')
      expect(body).toHaveProperty('releaseDate')
      expect(body).toHaveProperty('reviewCount')
      expect(body).toHaveProperty('averageRating')
      expect(body.reviewCount).toBe(0)
      expect(body).toHaveProperty('title')
    })

    test('returns 409 for duplicate title and artist', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)
      const { response } = await createAlbumViaHttp(token, {
        artist: payload.artist,
        title: payload.title,
      })

      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    test('returns 400 for empty title', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, { title: '' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty artist', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, { artist: '' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty genres array', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, { genres: [] })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for non-existent genre', async () => {
      const { token } = await createUserAndLogin()
      const payload = createAlbumPayload({ genres: ['NonExistentGenre'] })
      const response = await app.inject({
        headers: { authorization: `Bearer ${token}` },
        method: 'POST',
        payload,
        url: '/api/catalog',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for invalid format', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, {
        format: 'INVALID' as any,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for invalid releaseDate', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, {
        releaseDate: 'not-a-date',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 401 without auth token', async () => {
      const response = await app.inject({
        method: 'POST',
        payload: createAlbumPayload(),
        url: '/api/catalog',
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })
  })
})
