import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { ReviewRepository } from '../review-repository'
import type { ReviewId } from '../value-objects/review-id'

export class DomainReviewServices {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async ensureReviewNotExists(
    reviewId: ReviewId
  ): Promise<Result<void, ConflictError>> {
    const existing = await this.reviewRepository.findById(reviewId)
    if (existing) {
      return err(new ConflictError('Review para este álbum'))
    }
    return ok(undefined)
  }
}
