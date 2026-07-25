import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createGenreViaHttp, createUserAndLogin } from './helpers'

describe('Create Genre', () => {
  describe('POST /api/catalog/genres', () => {
    test('creates genre and returns 201 with dto', async () => {
      const { token } = await createUserAndLogin()

      const response = await createGenreViaHttp(token, 'Jazz')

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      const body = response.json()
      expect(body).toEqual({ name: 'Jazz', slug: 'jazz' })
    })

    test('returns 409 for duplicate genre', async () => {
      const { token } = await createUserAndLogin()

      await createGenreViaHttp(token, 'Jazz')
      const response = await createGenreViaHttp(token, 'Jazz')

      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    test('returns 401 without auth token', async () => {
      const response = await app.inject({
        method: 'POST',
        payload: { name: 'Jazz' },
        url: '/api/catalog/genres',
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })
  })
})
