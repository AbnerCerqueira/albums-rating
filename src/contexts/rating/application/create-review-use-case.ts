import z from 'zod'
import type {
  ConflictError,
  InvalidArgumentError,
  NotFoundError,
} from '@/contexts/!common/errors'
import { PublicId } from '@/contexts/!common/public-id'
import { ok, type Result } from '@/contexts/!common/result'
import type { AlbumGateway } from '../domain/gateways/album-gateway'
import type { UserGateway } from '../domain/gateways/user-gateway'
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
  reviewText: z.string().nullable(),
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
    private readonly domainServices: DomainReviewServices,
    private readonly albumGateway: AlbumGateway,
    private readonly userGateway: UserGateway
  ) {}

  async execute(
    data: CreateReviewUseCaseRequest,
    userPublicId: string
  ): CreateReviewUseCaseResponse {
    const userResult = await this.userGateway.findUserByPublicId(
      PublicId.unsafe(userPublicId)
    )
    if (!userResult.ok) {
      return userResult
    }

    const albumResult = await this.albumGateway.findAlbumByPublicId(
      PublicId.unsafe(data.albumPublicId)
    )
    if (!albumResult.ok) {
      return albumResult
    }

    const reviewId = ReviewId.create({
      albumId: albumResult.value.id,
      userId: userResult.value.id,
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
