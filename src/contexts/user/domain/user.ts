import type { Password } from './value-objects/password'
import type { UserId } from './value-objects/user-id'

export class User {
  private readonly _id: UserId

  private readonly _password: Password

  public constructor(id: UserId, password: Password) {
    this._id = id
    this._password = password
  }

  public get id(): UserId {
    return this._id
  }

  public get password(): Password {
    return this._password
  }
}
