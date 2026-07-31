import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'

export type AlbumChartEntry = {
  albumId: string
  artist: string
  averageRating: number
  format: string
  genres: string[]
  genreSlugs: string[]
  publicId: string
  releaseDate: Date
  reviewCount: number
  title: string
  weightedScore: number
}

export type AlbumChartFilters = {
  from?: number
  to?: number
  genre?: string
  format?: string
}

export interface AlbumChartsRepository {
  findMostReviewed: (
    filters: AlbumChartFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<AlbumChartEntry>>
  findTopRated: (
    filters: AlbumChartFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<AlbumChartEntry>>
  refreshAll: () => Promise<void>
}
