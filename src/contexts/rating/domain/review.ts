import { PublicId } from '@/contexts/!common/public-id'
import type { Rating } from './value-objects/rating'
import type { ReviewId } from './value-objects/review-id'
import type { ReviewText } from './value-objects/review-text'
import type { ReviewedAt } from './value-objects/reviewed-at'

export type ReviewProps = {
  id: ReviewId
  isFavorite: boolean
  isEdited: boolean
  rating: Rating
  reviewText?: ReviewText
  reviewedAt: ReviewedAt
}

export type ReviewPersistenceProps = ReviewProps & {
  publicId: PublicId
  createdAt: Date
  updatedAt: Date
}

export class Review {
  private constructor(
    readonly id: ReviewId,
    readonly isFavorite: boolean,
    readonly isEdited: boolean,
    readonly rating: Rating,
    readonly reviewText: ReviewText | undefined,
    readonly reviewedAt: ReviewedAt,
    readonly publicId: PublicId,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  static create(props: ReviewProps) {
    return new Review(
      props.id,
      props.isFavorite,
      props.isEdited,
      props.rating,
      props.reviewText,
      props.reviewedAt,
      PublicId.create(),
      new Date(),
      new Date()
    )
  }

  static fromPersistence(props: ReviewPersistenceProps) {
    return new Review(
      props.id,
      props.isFavorite,
      props.isEdited,
      props.rating,
      props.reviewText,
      props.reviewedAt,
      props.publicId,
      new Date(props.createdAt),
      new Date(props.updatedAt)
    )
  }

  getCreationDate(): Date {
    return new Date(this.createdAt.getTime())
  }

  getUpdateDate(): Date {
    return new Date(this.updatedAt.getTime())
  }

  equals(other: Review) {
    return this.id.equals(other.id)
  }
}
