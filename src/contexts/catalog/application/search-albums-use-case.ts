import type { Pagination } from '@/contexts/!common/pagination'
import type { AlbumRepository } from '../domain/album-repository'
import type { AlbumReviewCountGateway } from '../domain/gateways/album-review-count-gateway'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export type SearchAlbumsUseCaseRequest = {
  artist?: string
  title?: string
  pagination?: Pagination
}

export type SearchAlbumsUseCaseResponse = Promise<{
  albums: AlbumDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}>

export class SearchAlbumsUseCase {
  constructor(
    private readonly repository: AlbumRepository,
    private readonly reviewCountGateway: AlbumReviewCountGateway
  ) {}

  async execute(data: SearchAlbumsUseCaseRequest): SearchAlbumsUseCaseResponse {
    const { artist, title, pagination } = data

    const result = await this.repository.search({ artist, title }, pagination)
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
