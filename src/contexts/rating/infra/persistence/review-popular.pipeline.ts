import type { PipelineStage } from 'mongoose'
import type { PopularFilters } from '@/contexts/rating/domain/review-repository'

export function buildPopularPipeline(filters: PopularFilters): PipelineStage[] {
  const { from, to, genre, format } = filters

  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: '$albumId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $addFields: {
        averageRating: { $round: ['$averageRating', 1] },
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
  ]

  if (from !== undefined || to !== undefined) {
    const conditions: Record<string, unknown>[] = []
    if (from !== undefined) {
      conditions.push({ $gte: [{ $year: '$album.releaseDate' }, from] })
    }
    if (to !== undefined) {
      conditions.push({ $lte: [{ $year: '$album.releaseDate' }, to] })
    }
    pipeline.push({
      $match: {
        $expr: { $and: conditions },
      },
    })
  }

  if (format) {
    pipeline.push({
      $match: { 'album.format': format },
    })
  }

  pipeline.push({
    $lookup: {
      as: 'genres',
      foreignField: '_id',
      from: 'genres',
      localField: 'album.genres',
    },
  })

  if (genre) {
    pipeline.push({
      $match: { 'genres.slug': genre },
    })
  }

  pipeline.push(
    {
      $project: {
        _id: 0,
        artist: '$album.artist',
        averageRating: 1,
        format: '$album.format',
        genres: '$genres.name',
        publicId: '$album.publicId',
        releaseDate: '$album.releaseDate',
        reviewCount: 1,
        title: '$album.title',
      },
    },
    { $sort: { reviewCount: -1 } }
  )

  return pipeline
}
