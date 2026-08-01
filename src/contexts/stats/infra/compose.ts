import { DomainEvents, eventBus } from '@/contexts/!common/event-bus'
import { RefreshChartsUseCase } from '../application/refresh-charts-use-case'
import { MongooseAlbumReviewCountGateway } from './gateways/album-review-count-gateway'
import { MongooseChartCacheGateway } from './gateways/chart-cache-gateway'
import { MongooseAlbumChartsRepository } from './persistence/album-charts-repository'

const albumChartsRepository = new MongooseAlbumChartsRepository()

export const refreshChartsUseCase = new RefreshChartsUseCase(
  albumChartsRepository
)

export const chartCacheGateway = new MongooseChartCacheGateway(
  albumChartsRepository
)

export const albumReviewCountGateway = new MongooseAlbumReviewCountGateway(
  albumChartsRepository
)

eventBus.subscribe(DomainEvents.CHART_CACHE_MISSED, () =>
  refreshChartsUseCase.execute()
)
