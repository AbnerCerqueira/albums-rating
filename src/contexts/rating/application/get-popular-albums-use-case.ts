import type { EventBus } from '@/contexts/!common/event-bus'
import { DomainEvents } from '@/contexts/!common/event-bus'
import type { Pagination } from '@/contexts/!common/pagination'
import type { ChartCacheGateway } from '../domain/gateways/chart-cache-gateway'
import type { PopularFilters } from '../domain/types/chart-types'
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
  constructor(
    private readonly chartCacheGateway: ChartCacheGateway,
    private readonly eventBus: EventBus
  ) {}

  async execute(
    data: GetPopularAlbumsUseCaseRequest
  ): Promise<GetPopularAlbumsUseCaseResponse> {
    const { from, to, genre, format, pagination } = data
    const filters = { format, from, genre, to }

    const cachedResult = await this.chartCacheGateway.findMostReviewed(
      filters,
      pagination
    )

    if (cachedResult.items.length === 0) {
      await this.eventBus.publish(DomainEvents.CHART_CACHE_MISSED)
      return {
        albums: [],
        currentPage: cachedResult.currentPage,
        size: cachedResult.size,
        total: cachedResult.total,
        totalPages: cachedResult.totalPages,
      }
    }

    return {
      albums: cachedResult.items.map((r) => ChartAlbumDTOMapper.toDTO(r)),
      currentPage: cachedResult.currentPage,
      size: cachedResult.size,
      total: cachedResult.total,
      totalPages: cachedResult.totalPages,
    }
  }
}
