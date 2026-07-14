import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAndLogin, createUserViaHttp } from './helpers'
import { UserRoutes } from './routes'

describe('Auth User', () => {
  describe('POST /api/user/login', () => {
    test('returns token on valid credentials', async () => {
      const { token, user } = await createAndLogin()

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('username')
    })

    test('returns 400 for wrong password', async () => {
      const { payload } = await createUserViaHttp()

      const response = await app.inject({
        method: 'POST',
        payload: { email: payload.email, password: 'wrong-password' },
        url: UserRoutes.POST.LOGIN,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for non-existent email', async () => {
      const response = await app.inject({
        method: 'POST',
        payload: { email: 'nonexistent@email.com', password: 'Teste@123' },
        url: UserRoutes.POST.LOGIN,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty email', async () => {
      const response = await app.inject({
        method: 'POST',
        payload: { email: '', password: 'Teste@123' },
        url: UserRoutes.POST.LOGIN,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for empty password', async () => {
      const response = await app.inject({
        method: 'POST',
        payload: { email: 'user@email.com', password: '' },
        url: UserRoutes.POST.LOGIN,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
