import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { AlbumReviewCounts } from '@/contexts/shared/album-review-counts'
import type {
  ChartAlbumProjection,
  ChartFilters,
} from '@/contexts/shared/chart-types'

export interface AlbumChartsRepository {
  findMostReviewed: (
    filters: ChartFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumProjection>>
  findReviewCountsByPublicIds: (
    publicIds: string[]
  ) => Promise<AlbumReviewCounts>
  findTopRated: (
    filters: ChartFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<ChartAlbumProjection>>
  refreshAll: () => Promise<void>
}
