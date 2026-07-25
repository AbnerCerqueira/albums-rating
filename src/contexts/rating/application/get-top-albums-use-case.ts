import type { Pagination } from '@/contexts/!common/pagination'
import type {
  ReviewRepository,
  TopRatedFilters,
} from '../domain/review-repository'
import { type TopAlbumDTO, TopAlbumDTOMapper } from './top-album-dto'

export type GetTopAlbumsUseCaseRequest = TopRatedFilters & {
  pagination?: Pagination
}

export type GetTopAlbumsUseCaseResponse = {
  albums: TopAlbumDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}

export class GetTopAlbumsUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(
    data: GetTopAlbumsUseCaseRequest
  ): Promise<GetTopAlbumsUseCaseResponse> {
    const { from, to, genre, format, pagination } = data

    const result = await this.reviewRepository.findTopRated(
      { format, from, genre, to },
      pagination
    )

    return {
      albums: result.items.map((r) => TopAlbumDTOMapper.toDTO(r)),
      currentPage: result.currentPage,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
