import { PublicId } from '@/contexts/!common/public-id'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { Review } from '@/contexts/rating/domain/review'
import { Rating } from '@/contexts/rating/domain/value-objects/rating'
import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { ReviewText } from '@/contexts/rating/domain/value-objects/review-text'
import { ReviewedAt } from '@/contexts/rating/domain/value-objects/reviewed-at'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import type { ReviewData } from './review-model'

function toPersistence(review: Review): ReviewData {
  return {
    createdAt: review.getCreationDate(),
    domainId: {
      albumArtist: review.id.albumId.artist.value,
      albumTitle: review.id.albumId.title.value,
      userEmail: review.id.userId.email.value,
      username: review.id.userId.username.value,
    },
    isEdited: review.isEdited,
    isFavorite: review.isFavorite,
    publicId: review.publicId.value,
    rating: review.rating.value,
    reviewedAt: review.reviewedAt.value,
    reviewText: review.reviewText?.value,
    updatedAt: review.getUpdateDate(),
  }
}

function toDomain(data: ReviewData): Review {
  const {
    createdAt,
    domainId,
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
      artist: Artist.unsafe(domainId.albumArtist),
      title: Title.unsafe(domainId.albumTitle),
    }),
    userId: UserId.create({
      email: Email.unsafe(domainId.userEmail),
      username: Username.unsafe(domainId.username),
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
    reviewText: reviewText ? ReviewText.unsafe(reviewText) : undefined,
    updatedAt: new Date(updatedAt),
  })
}

export const ReviewMapper = { toDomain, toPersistence }
