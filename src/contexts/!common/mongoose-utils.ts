import type { Aggregate, Query } from 'mongoose'
import type { Pagination } from './pagination'

function withPagination(
  // biome-ignore lint/suspicious/noExplicitAny: necessário
  aggregate: Aggregate<any> | Query<any, any>,
  pagination: Pagination
): void {
  const { page, size } = pagination
  aggregate.skip(size * (page - 1)).limit(size)
}

export const MongooseUtils = {
  withPagination,
}
