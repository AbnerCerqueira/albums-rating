import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { ChartAlbumProjection } from '@/contexts/shared/chart-types'
import type { PopularFilters, TopRatedFilters } from '../types/chart-types'

export interface ChartCacheGateway {
  findMostReviewed: (
    filters: PopularFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumProjection>>
  findTopRated: (
    filters: TopRatedFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumProjection>>
}
