import type { Pagination } from '@/contexts/!common/pagination'
import type { AlbumRepository } from '../domain/album-repository'
import type { AlbumReviewCountGateway } from '../domain/gateways/album-review-count-gateway'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export type GetAllAlbumsUseCaseRequest = {
  pagination?: Pagination
}

export type GetAllAlbumsUseCaseResponse = Promise<{
  albums: AlbumDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}>

export class GetAllAlbumsUseCase {
  constructor(
    private readonly repository: AlbumRepository,
    private readonly reviewCountGateway: AlbumReviewCountGateway
  ) {}

  async execute(data: GetAllAlbumsUseCaseRequest): GetAllAlbumsUseCaseResponse {
    const { pagination } = data

    const result = await this.repository.find(pagination)
    const reviewCounts = await this.reviewCountGateway.findCountsByPublicIds(
      result.items.map((album) => album.publicId)
    )

    return {
      albums: result.items.map((a) =>
        AlbumDTOMapper.toDTO(
          a,
          reviewCounts[a.publicId.value] ?? { averageRating: 0, reviewCount: 0 }
        )
      ),
      currentPage: result.currentPage,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
