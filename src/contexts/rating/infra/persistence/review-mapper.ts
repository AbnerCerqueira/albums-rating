import { PublicId } from '@/contexts/!common/public-id'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { Review, type ReviewProps } from '@/contexts/rating/domain/review'
import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import type { ReviewData } from './review-model'

function toPersistence(review: Review): ReviewData {
  const { id, props, publicId } = review
  const { userId, albumId } = id
  const { isFavorite, isEdited, rating, reviewedAt } = props

  return {
    domainId: {
      albumArtist: albumId.artist,
      albumTitle: albumId.title.value,
      userEmail: userId.email.value,
      username: userId.username.value,
    },
    isEdited,
    isFavorite,
    publicId: publicId.toString(),
    rating,
    reviewedAt,
  }
}

function toDomain(data: ReviewData): Review {
  const { domainId, isFavorite, isEdited, publicId, rating, reviewedAt } = data

  const reviewId = new ReviewId(
    new UserId(
      Email.unsafeCreate(domainId.userEmail),
      Username.unsafeCreate(domainId.username)
    ),
    new AlbumId(Title.unsafeCreate(domainId.albumTitle), domainId.albumArtist)
  )

  const reviewProps: ReviewProps = {
    isEdited,
    isFavorite,
    rating,
    reviewedAt,
  }

  return new Review(reviewId, reviewProps, new PublicId(publicId))
}

export const ReviewMapper = { toDomain, toPersistence }
