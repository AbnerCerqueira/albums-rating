import type { NotFoundError } from '@/contexts/!common/errors'
import type { Pagination } from '@/contexts/!common/pagination'
import { ok, type Result } from '@/contexts/!common/result'
import type { UserGateway } from '../domain/gateways/user-gateway'
import type { ReviewRepository } from '../domain/review-repository'
import { type ReviewDTO, ReviewDTOMapper } from './review-dto'

export type GetReviewsByUserUseCaseRequest = {
  username: string
  pagination?: Pagination
}

export type GetReviewsByUserUseCaseResponse = Promise<
  Result<
    {
      reviews: ReviewDTO[]
      currentPage?: number
      size?: number
      total?: number
      totalPages?: number
    },
    NotFoundError
  >
>

export class GetReviewsByUserUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userGateway: UserGateway
  ) {}

  async execute(
    data: GetReviewsByUserUseCaseRequest
  ): GetReviewsByUserUseCaseResponse {
    const { username, pagination } = data

    const userResult = await this.userGateway.findUserByUsername(username)
    if (!userResult.ok) {
      return userResult
    }

    const result = await this.reviewRepository.findByUser(
      userResult.value.id,
      pagination
    )

    return ok({
      currentPage: result.currentPage,
      reviews: result.items.map((r) => ReviewDTOMapper.toDTO(r)),
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    })
  }
}
