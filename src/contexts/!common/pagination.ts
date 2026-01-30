import { DomainError } from './domain-error'
import { err, ok, type Result } from './result'

export class Pagination {
  public readonly page: number

  public readonly size: number

  private constructor(page: number, size: number) {
    this.page = page
    this.size = size
  }

  public static create(
    page: number,
    size: number
  ): Result<Pagination, DomainError.InvalidArgument> {
    return page > 0 && size > 0
      ? ok(new Pagination(page, size))
      : err(
          new DomainError.InvalidArgument(
            'Página e tamanho devem ser de no mínimo 1'
          )
        )
  }

  public static unsafeCreate(page: number, size: number): Pagination {
    return new Pagination(page, size)
  }
}
