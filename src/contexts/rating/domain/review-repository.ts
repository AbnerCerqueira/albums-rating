import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Review } from './review'
import type { ReviewId } from './value-objects/review-id'

export interface ReviewRepository {
  delete: (id: ReviewId) => Promise<boolean>
  findByAlbum: (albumId: AlbumId, pagination?: Pagination) => Promise<Review[]>
  findById: (id: ReviewId) => Promise<Review | null>
  findByPublicId: (publicId: PublicId) => Promise<Review | null>
  findByUser: (userId: UserId, pagination?: Pagination) => Promise<Review[]>
  findRecent: (pagination?: Pagination) => Promise<Review[]>
  save: (review: Review) => Promise<Review>
}
