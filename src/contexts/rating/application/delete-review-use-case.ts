import type { ForbiddenError, NotFoundError } from '@/contexts/!common/errors'
import { PublicId } from '@/contexts/!common/public-id'
import { ok, type Result } from '@/contexts/!common/result'
import type { ReviewRepository } from '../domain/review-repository'
import type { DomainReviewServices } from '../domain/services/domain-review-services'

export type DeleteReviewUseCaseResponse = Promise<
  Result<void, NotFoundError | ForbiddenError>
>

export class DeleteReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly domainServices: DomainReviewServices
  ) {}

  async execute(
    reviewPublicId: string,
    userPublicId: string
  ): DeleteReviewUseCaseResponse {
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

    await this.reviewRepository.delete(review.id)

    return ok(undefined)
  }
}
