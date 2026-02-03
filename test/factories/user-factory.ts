import { faker } from '@faker-js/faker'
import type { FastifyInstance } from 'fastify'
import { app } from '@/app'
import type { PublicId } from '@/contexts/!common/public-id'
import type { CreateUserUseCaseRequest } from '@/contexts/user/application/use-cases/create-user-use-case'
import type { UserDTO } from '@/contexts/user/application/user-dto'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import { UserRoutes } from '../e2e/user/routes'

function createUnit(qty = 1, publicId?: PublicId): User[] {
  return Array.from({ length: qty }).map(() => {
    const username = Username.unsafeCreate(faker.person.firstName())
    const email = Email.unsafeCreate(faker.internet.email())
    const id = new UserId(username, email)
    const password = Password.unsafeCreate('password123')
    return new User(id, { password }, publicId)
  })
}

const UNIT_OR_INTEGRATION = {
  create: createUnit,
}

function createPayload(qty = 1): CreateUserUseCaseRequest[] {
  return Array.from({ length: qty }).map(() => {
    const username = faker.person.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    return {
      email,
      username,
      password,
    }
  })
}

async function createAndLogin(
  instance: FastifyInstance = app
): Promise<{ user: UserDTO } & { token: string }> {
  const [payload] = createPayload()

  const createRes = await instance.inject({
    method: 'POST',
    url: UserRoutes.POST.CREATE_USER,
    payload,
  })
  const user = createRes.json() as UserDTO

  const loginRes = await instance.inject({
    method: 'POST',
    url: UserRoutes.GET.LOGIN,
    payload: { email: payload.email, password: payload.password },
  })
  const { token } = loginRes.json() as { token: string }

  return { token, user }
}

export const E2E = {
  createPayload,
  createAndLogin,
}

export const UserFactory = { E2E, UNIT_OR_INTEGRATION }
