import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'

export type AlbumChartEntry = {
  albumId: string
  artist: string
  averageRating: number
  coverUrl: string
  format: string
  genres: string[]
  genreSlugs: string[]
  publicId: string
  releaseDate: Date
  reviewCount: number
  title: string
  weightedScore: number
}

export type AlbumReviewCountByPublicId = {
  publicId: string
  reviewCount: number
  averageRating: number
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
  findReviewCountsByPublicIds: (
    publicIds: string[]
  ) => Promise<AlbumReviewCountByPublicId[]>
  findTopRated: (
    filters: AlbumChartFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<AlbumChartEntry>>
  refreshAll: () => Promise<void>
}
