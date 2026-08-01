import { NotFoundError } from '@/contexts/!common/errors'
import type { PublicId } from '@/contexts/!common/public-id'
import { ok, type Result } from '@/contexts/!common/result'
import type { AlbumRepository } from '../domain/album-repository'
import type { AlbumReviewCountGateway } from '../domain/gateways/album-review-count-gateway'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export type GetAlbumByPublicIdUseCaseRequest = {
  publicId: PublicId
}

export type GetAlbumByPublicIdUseCaseResponse = Promise<
  Result<AlbumDTO, NotFoundError>
>

export class GetAlbumByPublicIdUseCase {
  constructor(
    private readonly repository: AlbumRepository,
    private readonly reviewCountGateway: AlbumReviewCountGateway
  ) {}

  async execute(
    data: GetAlbumByPublicIdUseCaseRequest
  ): GetAlbumByPublicIdUseCaseResponse {
    const { publicId } = data

    const foundAlbum = await this.repository.findByPublicId(publicId)

    if (!foundAlbum) {
      return { error: new NotFoundError('Álbum'), ok: false }
    }

    const reviewCounts = await this.reviewCountGateway.findCountsByPublicIds([
      publicId,
    ])

    return ok(
      AlbumDTOMapper.toDTO(
        foundAlbum,
        reviewCounts[publicId.value] ?? { averageRating: 0, reviewCount: 0 }
      )
    )
  }
}
