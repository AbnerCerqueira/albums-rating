import { PublicId } from '@/contexts/common/public-id'
import type { Email } from './value-objects/email'
import type { Password } from './value-objects/password'
import type { Username } from './value-objects/username'

export type UserProps = {
  username: Username
  email: Email
  password: Password
}

export class User {
  public id: PublicId

  public props: UserProps

  public constructor(props: UserProps, id?: PublicId) {
    this.id = id ?? new PublicId()
    this.props = props
  }
}
