import { DomainEvents, eventBus } from '@/contexts/!common/event-bus'
import { RefreshChartsUseCase } from '../application/refresh-charts-use-case'
import { MongooseChartCacheGateway } from './gateways/chart-cache-gateway'
import { MongooseAlbumChartsRepository } from './persistence/album-charts-repository'

const albumChartsRepository = new MongooseAlbumChartsRepository()

export const refreshChartsUseCase = new RefreshChartsUseCase(
  albumChartsRepository
)

export const chartCacheGateway = new MongooseChartCacheGateway(
  albumChartsRepository
)

eventBus.subscribe(DomainEvents.CHART_CACHE_MISSED, () =>
  refreshChartsUseCase.execute()
)
