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

export type PaginatedResult<T> = {
  items: T[]
  total: number
  currentPage: number
  size: number
  totalPages: number
}

export function toPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: Pagination
): PaginatedResult<T> {
  return {
    currentPage: pagination.page,
    items,
    size: pagination.size,
    total,
    totalPages: Math.ceil(total / pagination.size),
  }
}

export function emptyPaginatedResult<T>(): PaginatedResult<T> {
  return { currentPage: 1, items: [], size: 0, total: 0, totalPages: 1 }
}
