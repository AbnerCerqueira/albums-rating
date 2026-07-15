import type { NotFoundError } from '@/contexts/!common/errors'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Result } from '@/contexts/!common/result'
import type { Album } from '@/contexts/catalog/domain/album'
import type { User } from '@/contexts/user/domain/user'
import type { Review } from '../review'

export type UserAndAlbum = {
  album: Album
  user: User
}

export type UserAndReview = {
  user: User
  review: Review
}

export interface ReviewGateway {
  findUserAndAlbumForReview: (
    userPublicId: PublicId,
    albumPublicId: PublicId
  ) => Promise<Result<UserAndAlbum, NotFoundError>>

  findUserAndReviewForEdit: (
    userPublicId: PublicId,
    reviewPublicId: PublicId
  ) => Promise<Result<UserAndReview, NotFoundError>>

  findUserByUsername: (username: string) => Promise<Result<User, NotFoundError>>
}
