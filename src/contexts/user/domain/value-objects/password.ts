import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'

export class Password {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(
    value: string
  ): Result<Password, DomainError.InvalidArgument> {
    if (value.length < 6) {
      return err(
        new DomainError.InvalidArgument(
          'Senha deve ter pelo menos 6 caracteres'
        )
      )
    }

    if (value.length > 100) {
      return err(
        new DomainError.InvalidArgument(
          'Senha deve ter no máximo 100 caracteres'
        )
      )
    }

    return ok(new Password(value))
  }

  public static unsafeCreate(value: string): Password {
    return new Password(value)
  }

  public get value(): string {
    return this._value
  }
}
