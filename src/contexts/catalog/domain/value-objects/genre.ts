import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Genre {
  private constructor(readonly value: string) {}

  static create(genre: string): Result<Genre, InvalidArgumentError> {
    const trimmed = genre.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Gênero não pode ser vazio'))
    }

    if (trimmed.length > 50) {
      return err(
        new InvalidArgumentError('Gênero deve ter no máximo 50 caracteres')
      )
    }

    return ok(new Genre(trimmed))
  }

  static unsafe(genre: string) {
    return new Genre(genre)
  }

  equals(other: Genre) {
    return this.value === other.value
  }
}
