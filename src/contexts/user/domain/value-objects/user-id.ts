import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'

export class UserId {
  private readonly _username: string

  private constructor(username: string) {
    this._username = username
  }

  public static create(
    username: string
  ): Result<UserId, DomainError.InvalidArgument> {
    if (username.length < 3) {
      return err(
        new DomainError.InvalidArgument(
          'Nome de usuário deve ter pelo menos 3 caracteres'
        )
      )
    }

    if (username.length > 100) {
      return err(
        new DomainError.InvalidArgument(
          'Nome de usuário deve ter no máximo 100 caracteres'
        )
      )
    }

    return ok(new UserId(username))
  }

  public get username(): string {
    return this._username
  }
}
