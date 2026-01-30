import z from 'zod'
import type { Pagination } from '@/contexts/!common/pagination'

export const paginationQuerystring = z.object({
  page: z.coerce.number(),
  size: z.coerce.number(),
}) satisfies z.ZodType<Pagination>
