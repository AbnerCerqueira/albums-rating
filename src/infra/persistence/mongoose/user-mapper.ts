import { PublicId } from '@/contexts/common/public-id'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import type { UserData } from './user-model'

function toPersistence(user: User): UserData {
  const { id, props } = user
  const { email, username } = id
  const { password } = props
  return {
    domainId: {
      email: email.value,
      username: username.value,
    },
    publicId: user.publicId.toString(),
    password: password.value,
  }
}

function toDomain(data: UserData): User {
  const { domainId, password, publicId } = data
  const { email, username } = domainId

  const id = new UserId(
    Email.unsafeCreate(email),
    Username.unsafeCreate(username)
  )

  return new User(
    id,
    { password: Password.unsafeCreate(password) },
    new PublicId(publicId)
  )
}

export const MongooseUserMapper = { toPersistence, toDomain }
