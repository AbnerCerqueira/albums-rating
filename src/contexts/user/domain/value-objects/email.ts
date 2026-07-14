import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export class Email {
  private constructor(readonly value: string) {}

  static create(email: string): Result<Email, InvalidArgumentError> {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      return err(new InvalidArgumentError('Email não pode ser vazio'))
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return err(
        new InvalidArgumentError(
          'Formato inválido Email. Esperado: email@email.com'
        )
      )
    }
    return ok(new Email(trimmed))
  }

  static unsafe(email: string): Email {
    return new Email(email.trim().toLowerCase())
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
