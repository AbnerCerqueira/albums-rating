import { PublicId } from '@/contexts/!common/public-id'
import type { Password } from '@/contexts/user/domain/value-objects/password'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export type UserProps = {
  id: UserId
  password: Password
}

export type UserPersistenceProps = UserProps & {
  publicId: PublicId
  createdAt: Date
  updatedAt: Date
}

export class User {
  private constructor(
    readonly id: UserId,
    readonly password: Password,
    readonly publicId: PublicId,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  getCreationDate(): Date {
    return new Date(this.createdAt.getTime())
  }

  getUpdateDate(): Date {
    return new Date(this.updatedAt.getTime())
  }

  static create(props: UserProps): User {
    return new User(
      props.id,
      props.password,
      PublicId.create(),
      new Date(),
      new Date()
    )
  }

  static fromPersistence(props: UserPersistenceProps): User {
    return new User(
      props.id,
      props.password,
      props.publicId,
      new Date(props.createdAt),
      new Date(props.updatedAt)
    )
  }

  equals(other: User): boolean {
    return this.id.equals(other.id)
  }
}
