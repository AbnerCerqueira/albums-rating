import { Review, type ReviewProps } from '@/contexts/rating/domain/review'
import { Rating } from '@/contexts/rating/domain/value-objects/rating'
import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { ReviewText } from '@/contexts/rating/domain/value-objects/review-text'
import { ReviewedAt } from '@/contexts/rating/domain/value-objects/reviewed-at'
import {
  createTestAlbumId,
  createTestUserId,
  RATING,
  REVIEW_TEXT,
  REVIEWED_AT,
} from './fixtures'

export function createReview(overrides?: Partial<ReviewProps>): Review {
  const userId = createTestUserId()
  const albumId = createTestAlbumId()

  const id = overrides?.id ?? ReviewId.create({ albumId, userId })
  const isFavorite = overrides?.isFavorite ?? false
  const rating = overrides?.rating ?? Rating.unsafe(RATING)
  const reviewText =
    'reviewText' in (overrides ?? {})
      ? (overrides?.reviewText ?? null)
      : ReviewText.unsafe(REVIEW_TEXT)
  const reviewedAt = overrides?.reviewedAt ?? ReviewedAt.unsafe(REVIEWED_AT)

  return Review.create({ id, isFavorite, rating, reviewedAt, reviewText })
}
