import z from 'zod'
import {
  type ForbiddenError,
  type InvalidArgumentError,
  NotFoundError,
} from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import { PublicId } from '@/contexts/shared/public-id'
import type { UserGateway } from '../domain/gateways/user-gateway'
import type { ReviewRepository } from '../domain/review-repository'
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
    private readonly userGateway: UserGateway
  ) {}

  async execute(
    data: EditReviewUseCaseRequest,
    reviewPublicId: string,
    userPublicId: string
  ): EditReviewUseCaseResponse {
    const userResult = await this.userGateway.findUserByPublicId(
      PublicId.unsafe(userPublicId)
    )
    if (!userResult.ok) {
      return userResult
    }

    const review = await this.reviewRepository.findByPublicId(
      PublicId.unsafe(reviewPublicId)
    )
    if (!review) {
      return err(new NotFoundError('Review'))
    }

    const ownershipResult = review.ensureOwnership(userResult.value.id)
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
