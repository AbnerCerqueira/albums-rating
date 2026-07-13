import { extract } from '@/contexts/!common/result'
import { User, type UserProps } from '@/contexts/user/domain/user'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { EMAIL, PASSWORD, USERNAME } from './fixtures'

export function createUser(overrides?: Partial<UserProps>): User {
  const id =
    overrides?.id ??
    extract(UserId.create({ email: EMAIL, username: USERNAME }))
  const password = overrides?.password ?? extract(Password.create(PASSWORD))

  return User.create({ id, password })
}
