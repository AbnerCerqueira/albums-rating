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
    test('creates album and returns 200 with dto', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token)

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<AlbumPayload>()
      expect(body).toHaveProperty('artist')
      expect(body).toHaveProperty('format')
      expect(body).toHaveProperty('genre')
      expect(body).toHaveProperty('publicId')
      expect(body).toHaveProperty('releaseDate')
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

    test('returns 400 for empty genre', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await createAlbumViaHttp(token, { genre: '' })

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
