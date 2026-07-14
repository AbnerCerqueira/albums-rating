import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class ReviewedAt {
  private constructor(readonly value: Date) {}

  static create(reviewedAt: Date): Result<ReviewedAt, InvalidArgumentError> {
    if (!(reviewedAt instanceof Date) || Number.isNaN(reviewedAt.getTime())) {
      return err(new InvalidArgumentError('Data inválida'))
    }

    return ok(new ReviewedAt(reviewedAt))
  }

  static unsafe(reviewedAt: Date): ReviewedAt {
    return new ReviewedAt(new Date(reviewedAt.getTime()))
  }

  equals(other: ReviewedAt) {
    return this.value.getTime() === other.value.getTime()
  }
}
