import z from 'zod'
import type { Pagination } from '@/contexts/!common/pagination'
import {
  COMBINE_WITH,
  MATCH_TYPES,
  type SearchOptions,
} from '@/contexts/!common/search-options'

export const errorResponse = z.object({ message: z.string() })

const paginationQuerystring = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
}) satisfies z.ZodType<Partial<Pagination>>

const searchOptionsQuerystring = z.object({
  combineWith: z.enum(COMBINE_WITH).default('and'),
  matchType: z.enum(MATCH_TYPES).default('perfect'),
  ...paginationQuerystring.shape,
}) satisfies z.ZodType<Partial<Pagination> & SearchOptions>

const paginatedRoutesResponse = z.object({
  currentPage: z.number().optional(),
  size: z.number().optional(),
})

export const InfraSchemaUtils = {
  errorResponse,
  paginatedRoutesResponse,
  paginationQuerystring,
  searchOptionsQuerystring,
}
