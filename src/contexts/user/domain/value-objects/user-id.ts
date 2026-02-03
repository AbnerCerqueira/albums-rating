import type { Email } from './email'
import type { Username } from './username'

export class UserId {
  public constructor(
    public readonly email: Email,
    public readonly username: Username
  ) {}
}
