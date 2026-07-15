import z from 'zod'
import type {
  ConflictError,
  InvalidArgumentError,
  NotFoundError,
} from '@/contexts/!common/errors'
import { PublicId } from '@/contexts/!common/public-id'
import { ok, type Result } from '@/contexts/!common/result'
import { Review } from '../domain/review'
import type { ReviewRepository } from '../domain/review-repository'
import type { DomainReviewServices } from '../domain/services/domain-review-services'
import { Rating } from '../domain/value-objects/rating'
import { ReviewId } from '../domain/value-objects/review-id'
import { ReviewText } from '../domain/value-objects/review-text'
import { ReviewedAt } from '../domain/value-objects/reviewed-at'
import { type ReviewDTO, ReviewDTOMapper } from './review-dto'

export const zodCreateReviewUseCaseRequest = z.object({
  albumPublicId: z.string(),
  isFavorite: z.boolean().default(false),
  rating: z.number(),
  reviewText: z.string().optional(),
})

export type CreateReviewUseCaseRequest = z.infer<
  typeof zodCreateReviewUseCaseRequest
>

export type CreateReviewUseCaseResponse = Promise<
  Result<ReviewDTO, InvalidArgumentError | NotFoundError | ConflictError>
>

export class CreateReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly domainServices: DomainReviewServices
  ) {}

  async execute(
    data: CreateReviewUseCaseRequest,
    userPublicId: string
  ): CreateReviewUseCaseResponse {
    const entitiesResult =
      await this.domainServices.gateway.findUserAndAlbumForReview(
        PublicId.unsafe(userPublicId),
        PublicId.unsafe(data.albumPublicId)
      )
    if (!entitiesResult.ok) {
      return entitiesResult
    }

    const { album, user } = entitiesResult.value

    const reviewId = ReviewId.create({
      albumId: album.id,
      userId: user.id,
    })

    const notExistsResult =
      await this.domainServices.ensureReviewNotExists(reviewId)
    if (!notExistsResult.ok) {
      return notExistsResult
    }

    const rating = Rating.create(data.rating)
    if (!rating.ok) {
      return rating
    }

    let reviewText: ReviewText | null = null
    if (data.reviewText) {
      const textResult = ReviewText.create(data.reviewText)
      if (!textResult.ok) {
        return textResult
      }
      reviewText = textResult.value
    }

    const reviewedAt = ReviewedAt.create(new Date())
    if (!reviewedAt.ok) {
      return reviewedAt
    }

    const review = Review.create({
      id: reviewId,
      isFavorite: data.isFavorite,
      rating: rating.value,
      reviewedAt: reviewedAt.value,
      reviewText,
    })

    const saved = await this.reviewRepository.save(review)

    return ok(ReviewDTOMapper.toDTO(saved))
  }
}
