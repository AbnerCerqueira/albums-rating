import { type ForbiddenError, NotFoundError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import { PublicId } from '@/contexts/shared/public-id'
import type { UserGateway } from '../domain/gateways/user-gateway'
import type { ReviewRepository } from '../domain/review-repository'

export type DeleteReviewUseCaseResponse = Promise<
  Result<void, NotFoundError | ForbiddenError>
>

export class DeleteReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userGateway: UserGateway
  ) {}

  async execute(
    reviewPublicId: string,
    userPublicId: string
  ): DeleteReviewUseCaseResponse {
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

    await this.reviewRepository.delete(review.id)

    return ok(undefined)
  }
}
