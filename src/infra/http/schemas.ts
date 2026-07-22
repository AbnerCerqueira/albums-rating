import z from 'zod'
import type { Pagination } from '@/contexts/!common/pagination'

export const errorResponse = z.object({ message: z.string() })

const paginationQuerystring = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
}) satisfies z.ZodType<Partial<Pagination>>

const paginatedRoutesResponse = z.object({
  currentPage: z.number().optional(),
  size: z.number().optional(),
  total: z.number().optional(),
  totalPages: z.number().optional(),
})

export const InfraSchemaUtils = {
  errorResponse,
  paginatedRoutesResponse,
  paginationQuerystring,
}
