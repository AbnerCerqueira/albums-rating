import { ForbiddenError } from '@/contexts/!common/errors'
import { PublicId } from '@/contexts/!common/public-id'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Rating } from './value-objects/rating'
import type { ReviewId } from './value-objects/review-id'
import type { ReviewText } from './value-objects/review-text'
import type { ReviewedAt } from './value-objects/reviewed-at'

export type ReviewProps = {
  id: ReviewId
  isFavorite: boolean
  rating: Rating
  reviewText: ReviewText | null
  reviewedAt: ReviewedAt
}

export type ReviewPersistenceProps = ReviewProps & {
  publicId: PublicId
  isEdited: boolean
  createdAt: Date
  updatedAt: Date
}

export class Review {
  private constructor(
    readonly id: ReviewId,
    readonly isFavorite: boolean,
    readonly isEdited: boolean,
    readonly rating: Rating,
    readonly reviewText: ReviewText | null,
    readonly reviewedAt: ReviewedAt,
    readonly publicId: PublicId,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  static create(props: ReviewProps) {
    return new Review(
      props.id,
      props.isFavorite,
      false,
      props.rating,
      props.reviewText,
      props.reviewedAt,
      PublicId.create(),
      new Date(),
      new Date()
    )
  }

  edit(newText: ReviewText) {
    return new Review(
      this.id,
      this.isFavorite,
      true,
      this.rating,
      newText,
      this.reviewedAt,
      this.publicId,
      new Date(this.createdAt.getTime()),
      new Date()
    )
  }

  clearText() {
    return new Review(
      this.id,
      this.isFavorite,
      true,
      this.rating,
      null,
      this.reviewedAt,
      this.publicId,
      new Date(this.createdAt.getTime()),
      new Date()
    )
  }

  changeRating(newRating: Rating) {
    return new Review(
      this.id,
      this.isFavorite,
      true,
      newRating,
      this.reviewText,
      this.reviewedAt,
      this.publicId,
      new Date(this.createdAt.getTime()),
      new Date()
    )
  }

  toggleFavorite(isFavorite: boolean) {
    return new Review(
      this.id,
      isFavorite,
      this.isEdited,
      this.rating,
      this.reviewText,
      this.reviewedAt,
      this.publicId,
      new Date(this.createdAt.getTime()),
      new Date()
    )
  }

  ensureOwnership(userId: UserId): Result<void, ForbiddenError> {
    if (!this.id.userId.equals(userId)) {
      return err(
        new ForbiddenError('Você só pode editar suas próprias reviews')
      )
    }
    return ok(undefined)
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
