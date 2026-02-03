import { PublicId } from '@/contexts/!common/public-id'
import type { Password } from './value-objects/password'
import type { UserId } from './value-objects/user-id'

export type UserProps = {
  password: Password
}

export class User {
  public id: UserId

  public props: UserProps

  public publicId: PublicId

  public constructor(id: UserId, props: UserProps, publicId?: PublicId) {
    this.id = id
    this.props = props
    this.publicId = publicId ?? new PublicId()
  }
}
