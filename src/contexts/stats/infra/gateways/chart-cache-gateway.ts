import type { Pagination } from '@/contexts/!common/pagination'
import type { ChartCacheGateway } from '@/contexts/rating/domain/gateways/chart-cache-gateway'
import type {
  PopularFilters,
  TopRatedFilters,
} from '@/contexts/rating/domain/types/chart-types'
import type { AlbumChartsRepository } from '../../domain/album-charts-repository'

export class MongooseChartCacheGateway implements ChartCacheGateway {
  constructor(private readonly albumChartsRepository: AlbumChartsRepository) {}

  findTopRated(filters: TopRatedFilters, pagination?: Pagination) {
    return this.albumChartsRepository.findTopRated(filters, pagination)
  }

  findMostReviewed(filters: PopularFilters, pagination?: Pagination) {
    return this.albumChartsRepository.findMostReviewed(filters, pagination)
  }
}
