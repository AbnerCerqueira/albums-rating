import mongoose, { type FilterQuery, type PipelineStage } from 'mongoose'
import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import { AlbumReviewCounts } from '@/contexts/shared/album-review-counts'
import type {
  ChartAlbumProjection,
  ChartFilters,
} from '@/contexts/shared/chart-types'
import type { AlbumChartsRepository } from '../../domain/album-charts-repository'
import { type AlbumChartData, AlbumChartModel } from './album-charts-model'
import {
  type AlbumChartSourceReview,
  REVIEWS_COLLECTION,
} from './album-charts-source'

const BAYESIAN_MIN_REVIEWS = 5

function buildRefreshPipeline(): PipelineStage[] {
  return [
    {
      $group: {
        _id: '$albumId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $addFields: {
        averageRating: '$averageRating',
      },
    },
    {
      $lookup: {
        as: 'global',
        from: 'reviews',
        pipeline: [{ $group: { _id: null, avg: { $avg: '$rating' } } }],
      },
    },
    { $unwind: { path: '$global', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        globalAvg: { $ifNull: ['$global.avg', 0] },
      },
    },
    {
      $lookup: {
        as: 'album',
        foreignField: '_id',
        from: 'albums',
        localField: '_id',
      },
    },
    { $unwind: '$album' },
    {
      $lookup: {
        as: 'genres',
        foreignField: '_id',
        from: 'genres',
        localField: 'album.genres',
      },
    },
    {
      $project: {
        _id: 0,
        albumId: { $toString: '$_id' },
        artist: '$album.artist',
        averageRating: 1,
        coverUrl: '$album.coverUrl',
        format: '$album.format',
        genreSlugs: '$genres.slug',
        genres: '$genres.name',
        publicId: '$album.publicId',
        releaseDate: '$album.releaseDate',
        reviewCount: 1,
        title: '$album.title',
        weightedScore: {
          $divide: [
            {
              $add: [
                { $multiply: ['$averageRating', '$reviewCount'] },
                { $multiply: [BAYESIAN_MIN_REVIEWS, '$globalAvg'] },
              ],
            },
            { $add: ['$reviewCount', BAYESIAN_MIN_REVIEWS] },
          ],
        },
      },
    },
    { $out: 'album_charts' },
  ]
}

function buildQuery(filters: ChartFilters): FilterQuery<AlbumChartData> {
  const query: FilterQuery<AlbumChartData> = {}

  if (filters.format) {
    query.format = filters.format
  }

  if (filters.from !== undefined || filters.to !== undefined) {
    query.releaseDate = {}
    if (filters.from !== undefined) {
      query.releaseDate.$gte = new Date(filters.from, 0, 1)
    }
    if (filters.to !== undefined) {
      query.releaseDate.$lte = new Date(filters.to, 11, 31)
    }
  }

  if (filters.genre) {
    query.genreSlugs = { $in: [filters.genre] }
  }

  return query
}

function toEntry(data: AlbumChartData): ChartAlbumProjection {
  return {
    albumId: data.albumId,
    artist: data.artist,
    averageRating: data.averageRating,
    coverUrl: data.coverUrl,
    format: data.format,
    genreSlugs: data.genreSlugs,
    genres: data.genres,
    publicId: data.publicId,
    releaseDate: data.releaseDate,
    reviewCount: data.reviewCount,
    title: data.title,
    weightedScore: data.weightedScore,
  }
}

export class MongooseAlbumChartsRepository implements AlbumChartsRepository {
  private readonly model = AlbumChartModel

  async refreshAll(): Promise<void> {
    const pipeline = buildRefreshPipeline()
    await mongoose.connection
      .collection<AlbumChartSourceReview>(REVIEWS_COLLECTION)
      .aggregate(pipeline)
      .toArray()
  }

  findTopRated(
    filters: ChartFilters,
    pagination?: Pagination
  ): Promise<PaginatedResult<ChartAlbumProjection>> {
    const query = buildQuery(filters)
    const sort = { weightedScore: -1 } as const
    return this.findWithPagination(query, sort, pagination)
  }

  findMostReviewed(
    filters: ChartFilters,
    pagination?: Pagination
  ): Promise<PaginatedResult<ChartAlbumProjection>> {
    const query = buildQuery(filters)
    const sort = { reviewCount: -1 } as const
    return this.findWithPagination(query, sort, pagination)
  }

  async findReviewCountsByPublicIds(
    publicIds: string[]
  ): Promise<AlbumReviewCounts> {
    if (publicIds.length === 0) {
      return AlbumReviewCounts.fromRecord({})
    }

    const docs = await this.model
      .find(
        { publicId: { $in: publicIds } },
        { _id: 0, averageRating: 1, publicId: 1, reviewCount: 1 }
      )
      .lean()

    const record = Object.fromEntries(
      docs.map((doc) => [
        doc.publicId,
        { averageRating: doc.averageRating, reviewCount: doc.reviewCount },
      ])
    )

    return AlbumReviewCounts.fromRecord(record)
  }

  private async findWithPagination(
    query: FilterQuery<AlbumChartData>,
    sort: Record<string, 1 | -1>,
    pagination?: Pagination
  ): Promise<PaginatedResult<ChartAlbumProjection>> {
    const result = await MongooseUtils.paginateFind<AlbumChartData>(
      this.model,
      query,
      pagination,
      sort
    )
    return {
      ...result,
      items: result.items.map(toEntry),
    }
  }
}
