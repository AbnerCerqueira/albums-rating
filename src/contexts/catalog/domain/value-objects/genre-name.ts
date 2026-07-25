import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class GenreName {
  private constructor(readonly value: string) {}

  static create(name: string): Result<GenreName, InvalidArgumentError> {
    const trimmed = name.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Gênero não pode ser vazio'))
    }

    if (trimmed.length > 50) {
      return err(
        new InvalidArgumentError('Gênero deve ter no máximo 50 caracteres')
      )
    }

    return ok(new GenreName(trimmed))
  }

  static unsafe(name: string): GenreName {
    return new GenreName(name)
  }

  equals(other: GenreName): boolean {
    return this.value === other.value
  }
}
