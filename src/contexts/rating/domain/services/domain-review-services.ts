import { ConflictError, ForbiddenError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { User } from '@/contexts/user/domain/user'
import type { ReviewGateway } from '../gateways/review-gateway'
import type { Review } from '../review'
import type { ReviewRepository } from '../review-repository'
import type { ReviewId } from '../value-objects/review-id'

export class DomainReviewServices {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewGateway: ReviewGateway
  ) {}

  async ensureReviewNotExists(
    reviewId: ReviewId
  ): Promise<Result<void, ConflictError>> {
    const existing = await this.reviewRepository.findById(reviewId)
    if (existing) {
      return err(new ConflictError('Review para este álbum'))
    }
    return ok(undefined)
  }

  ensureOwnership(
    review: Review,
    userId: User['id']
  ): Result<void, ForbiddenError> {
    if (!review.id.userId.equals(userId)) {
      return err(
        new ForbiddenError('Você só pode editar suas próprias reviews')
      )
    }
    return ok(undefined)
  }

  get gateway() {
    return this.reviewGateway
  }
}
