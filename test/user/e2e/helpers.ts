import { faker } from '@faker-js/faker'
import { app } from '@/app'
import { UserRoutes } from './routes'

const DEFAULT_PASSWORD = 'Teste@123'

export type Payload = {
  email: string
  username: string
  password: string
}

export function createPayload(overrides?: Partial<Payload>): Payload {
  return {
    email: overrides?.email ?? faker.internet.email(),
    password: overrides?.password ?? DEFAULT_PASSWORD,
    username: overrides?.username ?? faker.person.firstName(),
  }
}

export async function createUserViaHttp(overrides?: Partial<Payload>) {
  const payload = createPayload(overrides)
  const response = await app.inject({
    method: 'POST',
    payload,
    url: UserRoutes.POST.CREATE_USER,
  })
  return { payload, response }
}

export async function createAndLogin() {
  const { payload } = await createUserViaHttp()

  const loginRes = await app.inject({
    method: 'POST',
    payload: { email: payload.email, password: payload.password },
    url: UserRoutes.POST.LOGIN,
  })

  return {
    token: loginRes.json<{ token: string }>().token,
    user: payload,
  }
}
