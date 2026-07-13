import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class ReleaseDate {
  private constructor(readonly value: Date) {}

  static create(date: Date): Result<ReleaseDate, InvalidArgumentError> {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return err(new InvalidArgumentError('Data inválida'))
    }

    return ok(new ReleaseDate(date))
  }

  static unsafe(date: Date) {
    return new ReleaseDate(new Date(date))
  }

  equals(other: ReleaseDate) {
    return this.value.getTime() === other.value.getTime()
  }
}
