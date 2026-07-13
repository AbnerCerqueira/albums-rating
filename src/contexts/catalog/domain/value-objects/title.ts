import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Title {
  private constructor(readonly value: string) {}

  static create(title: string): Result<Title, InvalidArgumentError> {
    const trimmed = title.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Título não pode ser vazio'))
    }

    return ok(new Title(trimmed))
  }

  static unsafe(title: string) {
    return new Title(title)
  }

  equals(other: Title) {
    return this.value === other.value
  }
}
