import { HttpStatus } from '@/infra/http/http-status'
import { createUserViaHttp, type Payload } from './helpers'

describe('Create User', () => {
  describe('POST /api/user', () => {
    test('creates user and returns 201 with dto', async () => {
      const { response } = await createUserViaHttp()

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      const body = response.json<Payload>()
      expect(body).toHaveProperty('email')
      expect(body).toHaveProperty('username')
      expect(body).toHaveProperty('publicId')
    })

    test('returns password as undefined in response', async () => {
      const { response } = await createUserViaHttp()

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      expect(response.json().password).toBeUndefined()
    })

    test('returns 409 for duplicate email', async () => {
      const { payload } = await createUserViaHttp()
      const { response } = await createUserViaHttp({ email: payload.email })

      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    test('returns 409 for duplicate username', async () => {
      const { payload } = await createUserViaHttp()
      const { response } = await createUserViaHttp({
        username: payload.username,
      })

      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    test('returns 400 for invalid email format', async () => {
      const { response } = await createUserViaHttp({ email: 'not-an-email' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty email', async () => {
      const { response } = await createUserViaHttp({ email: '' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty username', async () => {
      const { response } = await createUserViaHttp({ username: '' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for weak password without number', async () => {
      const { response } = await createUserViaHttp({
        password: 'Minhasenh@abc',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for weak password without uppercase', async () => {
      const { response } = await createUserViaHttp({ password: 'minhasenh@1' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for weak password without special char', async () => {
      const { response } = await createUserViaHttp({ password: 'Minhasenh1a' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for short password', async () => {
      const { response } = await createUserViaHttp({ password: 'Ab@1' })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
