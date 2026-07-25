import type { Pagination } from '@/contexts/!common/pagination'
import type {
  PopularFilters,
  ReviewRepository,
} from '../domain/review-repository'
import { type ChartAlbumDTO, ChartAlbumDTOMapper } from './chart-album-dto'

export type GetPopularAlbumsUseCaseRequest = PopularFilters & {
  pagination?: Pagination
}

export type GetPopularAlbumsUseCaseResponse = {
  albums: ChartAlbumDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}

export class GetPopularAlbumsUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(
    data: GetPopularAlbumsUseCaseRequest
  ): Promise<GetPopularAlbumsUseCaseResponse> {
    const { from, to, genre, format, pagination } = data

    const result = await this.reviewRepository.findMostReviewed(
      { format, from, genre, to },
      pagination
    )

    return {
      albums: result.items.map((r) => ChartAlbumDTOMapper.toDTO(r)),
      currentPage: result.currentPage,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
