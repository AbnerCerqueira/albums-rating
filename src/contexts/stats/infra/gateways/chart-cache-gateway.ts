import type { Pagination } from '@/contexts/!common/pagination'
import type { ChartCacheGateway } from '@/contexts/rating/domain/gateways/chart-cache-gateway'
import type {
  ChartAlbumRaw,
  PopularFilters,
  TopRatedFilters,
} from '@/contexts/rating/domain/types/chart-types'
import type {
  AlbumChartEntry,
  AlbumChartsRepository,
} from '../../domain/album-charts-repository'

function toChartAlbumRaw(entry: AlbumChartEntry): ChartAlbumRaw {
  return {
    artist: entry.artist,
    averageRating: entry.averageRating,
    coverUrl: entry.coverUrl,
    format: entry.format,
    genres: entry.genres,
    publicId: entry.publicId,
    releaseDate: entry.releaseDate,
    reviewCount: entry.reviewCount,
    title: entry.title,
  }
}

export class MongooseChartCacheGateway implements ChartCacheGateway {
  constructor(private readonly albumChartsRepository: AlbumChartsRepository) {}

  async findTopRated(filters: TopRatedFilters, pagination?: Pagination) {
    const result = await this.albumChartsRepository.findTopRated(
      filters,
      pagination
    )
    return {
      ...result,
      items: result.items.map(toChartAlbumRaw),
    }
  }

  async findMostReviewed(filters: PopularFilters, pagination?: Pagination) {
    const result = await this.albumChartsRepository.findMostReviewed(
      filters,
      pagination
    )
    return {
      ...result,
      items: result.items.map(toChartAlbumRaw),
    }
  }
}
