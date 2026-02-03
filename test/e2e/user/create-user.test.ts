import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { UserFactory } from '../../factories/user-factory'
import { UserRoutes } from './routes'

describe('POST /api/user', () => {
  it('should create user and return 201 without password', async () => {
    const [payload] = UserFactory.E2E.createPayload()
    const res = await app.inject({
      method: 'POST',
      url: UserRoutes.POST.CREATE_USER,
      payload,
    })

    expect(res.statusCode).toBe(HttpStatus.CREATED)
    const body = res.json()
    expect(body.password).toBeUndefined()
  })

  it('should return 409 when duplicate user', async () => {
    const [payload] = UserFactory.E2E.createPayload()

    await app.inject({
      method: 'POST',
      url: UserRoutes.POST.CREATE_USER,
      payload,
    })

    const res = await app.inject({
      method: 'POST',
      url: UserRoutes.POST.CREATE_USER,
      payload,
    })

    expect(res.statusCode).toBe(HttpStatus.CONFLICT)
  })
})

describe('Auth', () => {
  test('should create user and return with auth token', async () => {
    const { user, token } = await UserFactory.E2E.createAndLogin()

    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('publicId')
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })
})
