import { DomainError } from '@/contexts/!common/domain-error'
import { err, ok, type Result } from '@/contexts/!common/result'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export class Email {
  private constructor(public readonly value: string) {}

  public static create(
    value: string
  ): Result<Email, DomainError.InvalidArgument> {
    return emailRegex.test(value)
      ? ok(new Email(value))
      : err(new DomainError.InvalidArgument('Email inválido'))
  }

  public static unsafeCreate(email: string): Email {
    return new Email(email)
  }
}
