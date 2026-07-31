import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type {
  ChartAlbumRaw,
  PopularFilters,
  TopRatedFilters,
} from '../types/chart-types'

export interface ChartCacheGateway {
  findMostReviewed: (
    filters: PopularFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumRaw>>
  findTopRated: (
    filters: TopRatedFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumRaw>>
}
