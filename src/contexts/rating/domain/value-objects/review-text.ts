import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class ReviewText {
  private constructor(readonly value: string) {}

  static create(text: string): Result<ReviewText, InvalidArgumentError> {
    const trimmed = text.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Sua review não pode estar vazia'))
    }

    if (trimmed.length > 5000) {
      return err(
        new InvalidArgumentError('Sua review não pode exceder 5000 caracteres')
      )
    }

    return ok(new ReviewText(trimmed))
  }

  static unsafe(text: string): ReviewText {
    return new ReviewText(text)
  }

  equals(other: ReviewText) {
    return this.value === other.value
  }
}
