import z from 'zod'
import type {
  ForbiddenError,
  InvalidArgumentError,
  NotFoundError,
} from '@/contexts/!common/errors'
import { PublicId } from '@/contexts/!common/public-id'
import { ok, type Result } from '@/contexts/!common/result'
import type { ReviewRepository } from '../domain/review-repository'
import type { DomainReviewServices } from '../domain/services/domain-review-services'
import { Rating } from '../domain/value-objects/rating'
import { ReviewText } from '../domain/value-objects/review-text'
import { type ReviewDTO, ReviewDTOMapper } from './review-dto'

export const zodEditReviewUseCaseRequest = z.object({
  isFavorite: z.boolean().optional(),
  rating: z.number().optional(),
  reviewText: z.string().nullable().optional(),
})

export type EditReviewUseCaseRequest = z.infer<
  typeof zodEditReviewUseCaseRequest
>

export type EditReviewUseCaseResponse = Promise<
  Result<ReviewDTO, InvalidArgumentError | NotFoundError | ForbiddenError>
>

export class EditReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly domainServices: DomainReviewServices
  ) {}

  async execute(
    data: EditReviewUseCaseRequest,
    reviewPublicId: string,
    userPublicId: string
  ): EditReviewUseCaseResponse {
    const entitiesResult =
      await this.domainServices.gateway.findUserAndReviewForEdit(
        PublicId.unsafe(userPublicId),
        PublicId.unsafe(reviewPublicId)
      )
    if (!entitiesResult.ok) {
      return entitiesResult
    }

    const { review, user } = entitiesResult.value

    const ownershipResult = review.ensureOwnership(review, user.id)
    if (!ownershipResult.ok) {
      return ownershipResult
    }

    let currentReview = review

    if (data.rating !== undefined) {
      const rating = Rating.create(data.rating)
      if (!rating.ok) {
        return rating
      }
      currentReview = currentReview.changeRating(rating.value)
    }

    if (data.reviewText === null) {
      currentReview = currentReview.clearText()
    } else if (data.reviewText !== undefined) {
      const textResult = ReviewText.create(data.reviewText)
      if (!textResult.ok) {
        return textResult
      }
      currentReview = currentReview.edit(textResult.value)
    }

    if (data.isFavorite !== undefined) {
      currentReview = currentReview.toggleFavorite(data.isFavorite)
    }

    const saved = await this.reviewRepository.save(currentReview)

    return ok(ReviewDTOMapper.toDTO(saved))
  }
}
