import { DomainError } from '@/contexts/!common/domain-error'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Username {
  private constructor(public readonly value: string) {}

  public static create(
    username: string
  ): Result<Username, DomainError.InvalidArgument> {
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

    return ok(new Username(username))
  }

  public static unsafeCreate(username: string): Username {
    return new Username(username)
  }
}
