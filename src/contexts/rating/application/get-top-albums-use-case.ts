import type { EventBus } from '@/contexts/!common/event-bus'
import { DomainEvents } from '@/contexts/!common/event-bus'
import type { Pagination } from '@/contexts/!common/pagination'
import type { ChartFilters } from '@/contexts/shared/chart-types'
import type { ChartCacheGateway } from '../domain/gateways/chart-cache-gateway'
import { type ChartAlbumDTO, ChartAlbumDTOMapper } from './chart-album-dto'

export type GetTopAlbumsUseCaseRequest = ChartFilters & {
  pagination?: Pagination
}

export type GetTopAlbumsUseCaseResponse = {
  albums: ChartAlbumDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}

export class GetTopAlbumsUseCase {
  constructor(
    private readonly chartCacheGateway: ChartCacheGateway,
    private readonly eventBus: EventBus
  ) {}

  async execute(
    data: GetTopAlbumsUseCaseRequest
  ): Promise<GetTopAlbumsUseCaseResponse> {
    const { from, to, genre, format, pagination } = data
    const filters = { format, from, genre, to }

    const cachedResult = await this.chartCacheGateway.findTopRated(
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
