import type { NotFoundError } from '@/contexts/!common/errors'
import type { Pagination } from '@/contexts/!common/pagination'
import { ok, type Result } from '@/contexts/!common/result'
import type { PublicId } from '@/contexts/shared/public-id'
import type { AlbumGateway } from '../domain/gateways/album-gateway'
import type { ReviewRepository } from '../domain/review-repository'
import { type ReviewDTO, ReviewDTOMapper } from './review-dto'

export type GetReviewsByAlbumUseCaseRequest = {
  albumPublicId: PublicId
  pagination?: Pagination
}

export type GetReviewsByAlbumUseCaseResponse = Promise<
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

export class GetReviewsByAlbumUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly albumGateway: AlbumGateway
  ) {}

  async execute(
    data: GetReviewsByAlbumUseCaseRequest
  ): GetReviewsByAlbumUseCaseResponse {
    const { albumPublicId, pagination } = data

    const albumResult =
      await this.albumGateway.findAlbumByPublicId(albumPublicId)
    if (!albumResult.ok) {
      return albumResult
    }

    const result = await this.reviewRepository.findByAlbum(
      albumResult.value.id,
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
