import { PublicId } from '@/contexts/!common/public-id'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import type { UserData } from '@/contexts/user/infra/persistence/user-model'

function toPersistence(user: User): UserData {
  return {
    createdAt: user.getCreationDate(),
    email: user.id.email.value,
    password: user.password.value,
    publicId: user.publicId.value,
    updatedAt: user.getUpdateDate(),
    username: user.id.username.value,
  }
}

function toDomain(data: UserData): User {
  return User.fromPersistence({
    createdAt: new Date(data.createdAt),
    id: UserId.create({
      email: Email.unsafe(data.email),
      username: Username.unsafe(data.username),
    }),
    password: Password.fromHash(data.password),
    publicId: PublicId.unsafe(data.publicId),
    updatedAt: new Date(data.updatedAt),
  })
}

export const UserMapper = { toDomain, toPersistence }
