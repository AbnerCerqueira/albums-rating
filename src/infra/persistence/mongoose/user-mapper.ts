import type { Types } from 'mongoose'
import { User } from '@/contexts/user/domain/user'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { UserData } from './user-model'

function toPersistence(user: User): UserData {
  const { id, password } = user
  return {
    username: id.username,
    password: password.value,
  }
}

function toDomain(userData: UserData & { _id: Types.ObjectId }): User {
  const userId = UserId.unsafeCreate(userData.username)
  const password = Password.unsafeCreate(userData.password)

  return new User(userId, password)
}

export const MongooseUserMapper = { toPersistence, toDomain }
