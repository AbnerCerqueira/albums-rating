import type { Email } from './email'
import type { Username } from './username'

export class UserId {
  private constructor(
    readonly email: Email,
    readonly username: Username
  ) {}

  static create(props: { email: Email; username: Username }): UserId {
    return new UserId(props.email, props.username)
  }

  equals(other: UserId): boolean {
    return (
      this.email.equals(other.email) && this.username.equals(other.username)
    )
  }
}
