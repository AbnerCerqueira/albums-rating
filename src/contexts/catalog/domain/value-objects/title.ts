import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'

export class Title {
  private constructor(public readonly value: string) {}

  public static create(
    value: string
  ): Result<Title, DomainError.InvalidArgument> {
    return value.length > 200
      ? err(
          new DomainError.InvalidArgument(
            'Nome excede o limite de caracteres (200)'
          )
        )
      : ok(new Title(value))
  }

  public static unsafeCreate(value: string): Title {
    return new Title(value)
  }
}
