import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Format } from '@/contexts/catalog/domain/album'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Review } from './review'
import type { ReviewId } from './value-objects/review-id'

export type TopRatedFilters = {
  from?: number
  to?: number
  genre?: string
  format?: Format
}

export type TopRatedAlbumRaw = {
  averageRating: number
  reviewCount: number
  artist: string
  title: string
  publicId: string
  releaseDate: Date
  format: string
  genres: string[]
}

export interface ReviewRepository {
  delete: (id: ReviewId) => Promise<boolean>
  findByAlbum: (
    albumId: AlbumId,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Review>>
  findById: (id: ReviewId) => Promise<Review | null>
  findByPublicId: (publicId: PublicId) => Promise<Review | null>
  findByUser: (
    userId: UserId,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Review>>
  findRecent: (pagination?: Pagination) => Promise<PaginatedResult<Review>>
  findTopRated: (
    filters: TopRatedFilters,
    pagination?: Pagination
  ) => Promise<PaginatedResult<TopRatedAlbumRaw>>
  save: (review: Review) => Promise<Review>
}
