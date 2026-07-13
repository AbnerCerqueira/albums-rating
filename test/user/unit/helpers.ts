import { User, type UserProps } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import { EMAIL, PASSWORD, USERNAME } from './fixtures'

export function createUser(overrides?: Partial<UserProps>): User {
  const email = Email.unsafe(EMAIL)
  const username = Username.unsafe(USERNAME)
  const id = overrides?.id ?? UserId.create({ email, username })
  const password = overrides?.password ?? Password.unsafe(PASSWORD)

  return User.create({ id, password })
}
