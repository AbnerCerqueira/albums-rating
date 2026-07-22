import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Username {
  private constructor(readonly value: string) {}

  static create(username: string): Result<Username, InvalidArgumentError> {
    const trimmed = username.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Username não pode ser vazio'))
    }

    if (trimmed.length > 30) {
      return err(
        new InvalidArgumentError('Username deve ter no máximo 30 caracteres')
      )
    }

    return ok(new Username(trimmed))
  }

  static unsafe(username: string): Username {
    return new Username(username.trim())
  }

  equals(other: Username): boolean {
    return this.value === other.value
  }
}
