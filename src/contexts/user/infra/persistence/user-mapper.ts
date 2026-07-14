import { User } from '@/contexts/user/domain/user'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { UserData } from '@/contexts/user/infra/persistence/user-model'

export function toPersistence(user: User): UserData {
  return {
    createdAt: user.createdAt,
    domainId: {
      email: user.id.email,
      username: user.id.username,
    },
    password: user.password.value,
    publicId: user.publicId.value,
    updatedAt: user.updatedAt,
  }
}

export function toDomain(data: UserData): User {
  const id = UserId.unsafeCreate({
    email: data.domainId.email,
    username: data.domainId.username,
  })

  return User.fromPersistence({
    createdAt: new Date(data.createdAt),
    id,
    password: Password.unsafeCreate(data.password),
    publicId: data.publicId,
    updatedAt: new Date(data.updatedAt),
  })
}
