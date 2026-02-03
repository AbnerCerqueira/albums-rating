import z from 'zod'
import type { DomainError } from '@/contexts/!common/domain-error'
import { Pagination } from '@/contexts/!common/pagination'
import { err, ok, type Result, unwrap } from '@/contexts/!common/result'
import {
  COMBINE_WITH,
  MATCH_TYPES,
  type SearchStringOptions,
} from '@/contexts/!common/search-options'

export const errorResponse = z.object({ message: z.string() })

const paginationQuerystring = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
}) satisfies z.ZodType<Partial<Pagination>>

const searchStringOptionsQuerystring = z.object({
  combineWith: z.enum(COMBINE_WITH).default('and'),
  matchType: z.enum(MATCH_TYPES).default('perfect'),
  ...paginationQuerystring.shape,
}) satisfies z.ZodType<Partial<Pagination> & SearchStringOptions>

const paginatedRoutesResponse = z.object({
  currentPage: z.number().optional(),
  size: z.number().optional(),
})

function validatePagination(
  query: z.infer<typeof paginationQuerystring>
): Result<Pagination | undefined, DomainError.InvalidArgument> {
  if (!(query.page && query.size)) {
    return ok(undefined)
  }
  const [pagination, paginationErr] = unwrap(
    Pagination.create(query.page, query.size)
  )

  return paginationErr ? err(paginationErr) : ok(pagination)
}

export const InfraSchemaUtils = {
  validatePagination,
  paginatedRoutesResponse,
  searchStringOptionsQuerystring,
  paginationQuerystring,
  errorResponse,
}
