import { PublicId } from '@/contexts/!common/public-id'
import type { Album } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Review } from '@/contexts/rating/domain/review'
import { Rating } from '@/contexts/rating/domain/value-objects/rating'
import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { ReviewText } from '@/contexts/rating/domain/value-objects/review-text'
import { ReviewedAt } from '@/contexts/rating/domain/value-objects/reviewed-at'
import type { User } from '@/contexts/user/domain/user'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { ReviewData, ReviewPersistenceData } from './review-model'

function toPersistence(review: Review): ReviewPersistenceData {
  return {
    albumId: review.id.albumId.artist.value,
    createdAt: review.getCreationDate(),
    isEdited: review.isEdited,
    isFavorite: review.isFavorite,
    publicId: review.publicId.value,
    rating: review.rating.value,
    reviewedAt: review.reviewedAt.value,
    reviewText: review.reviewText ? review.reviewText.value : null,
    updatedAt: review.getUpdateDate(),
    userId: review.id.userId.email.value,
  }
}

function toDomain(
  data: Omit<ReviewData, 'userId' | 'albumId'>,
  user: User,
  album: Album
): Review {
  const {
    createdAt,
    isEdited,
    isFavorite,
    publicId,
    rating,
    reviewText,
    reviewedAt,
    updatedAt,
  } = data

  const reviewId = ReviewId.create({
    albumId: AlbumId.create({
      artist: album.id.artist,
      title: album.id.title,
    }),
    userId: UserId.create({
      email: user.id.email,
      username: user.id.username,
    }),
  })

  return Review.fromPersistence({
    createdAt: new Date(createdAt),
    id: reviewId,
    isEdited,
    isFavorite,
    publicId: PublicId.unsafe(publicId),
    rating: Rating.unsafe(rating),
    reviewedAt: ReviewedAt.unsafe(new Date(reviewedAt)),
    reviewText: reviewText ? ReviewText.unsafe(reviewText) : null,
    updatedAt: new Date(updatedAt),
  })
}

export const ReviewMapper = { toDomain, toPersistence }
