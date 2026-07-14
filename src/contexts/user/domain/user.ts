import { Entity, type Timestamps } from '@/contexts/!common/entity'
import { PublicId } from '@/contexts/!common/public-id'
import type { Password } from '@/contexts/user/domain/value-objects/password'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export type UserProps = {
  id: UserId
  password: Password
}

type UserPersistenceProps = UserProps & {
  publicId: string
  createdAt: Date
  updatedAt: Date
}

export class User extends Entity<UserProps> {
  private constructor(
    props: UserProps,
    publicId: User['publicId'],
    timestamps: Timestamps
  ) {
    super(props, publicId, timestamps)
  }

  static create(props: UserProps) {
    return new User(props, PublicId.create(), {
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static fromPersistence(props: UserPersistenceProps): User {
    return new User(
      { id: props.id, password: props.password },
      PublicId.create(props.publicId),
      { createdAt: props.createdAt, updatedAt: props.updatedAt }
    )
  }

  get id(): UserId {
    return this.props.id
  }

  get password(): Password {
    return this.props.password
  }

  equals(other: User): boolean {
    return this.id.equals(other.id)
  }
}
