import type { Types } from 'mongoose'
import { PublicId } from '@/contexts/common/public-id'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { Username } from '@/contexts/user/domain/value-objects/username'
import type { UserData } from './user-model'

function toPersistence(user: User): UserData {
  const { id, props } = user
  const { email, username, password } = props
  return {
    publicId: id.toString(),
    email: email.value,
    username: username.value,
    password: password.value,
  }
}

function toDomain(userData: UserData & { _id: Types.ObjectId }): User {
  const username = Username.unsafeCreate(userData.username)
  const password = Password.unsafeCreate(userData.password)
  const email = Email.unsafeCreate(userData.email)

  return new User(
    { username, email, password },
    new PublicId(userData.publicId)
  )
}

export const MongooseUserMapper = { toPersistence, toDomain }
