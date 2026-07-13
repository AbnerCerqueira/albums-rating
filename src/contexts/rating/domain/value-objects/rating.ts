import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Rating {
  private constructor(readonly value: number) {}

  static create(rating: number): Result<Rating, InvalidArgumentError> {
    if (rating < 0) {
      return err(new InvalidArgumentError('A nota mínima de avaliação é 0'))
    }

    if (rating > 5) {
      return err(new InvalidArgumentError('A nota máxima de avaliação é 5'))
    }
    return ok(new Rating(rating))
  }

  static unsafe(rating: number): Rating {
    return new Rating(rating)
  }

  equals(other: Rating) {
    return this.value === other.value
  }
}
