import { InvalidPaginationError } from './errors'
import { err, ok, type Result } from './result'

export class Pagination {
  readonly page: number

  readonly size: number

  private constructor(page: number, size: number) {
    this.page = page
    this.size = size
  }

  static create(
    page?: number,
    size?: number
  ): Result<Pagination | undefined, InvalidPaginationError> {
    if (!(page && size)) {
      return ok(undefined)
    }

    return page > 0 && size > 0
      ? ok(new Pagination(page, size))
      : err(new InvalidPaginationError())
  }

  static unsafeCreate(page: number, size: number): Pagination {
    return new Pagination(page, size)
  }
}
