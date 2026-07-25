import type { Model } from 'mongoose'
import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import {
  emptyPaginatedResult,
  type PaginatedResult,
  type Pagination,
} from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { AlbumMapper } from '@/contexts/catalog/infra/persistence/album-mapper'
import type { AlbumData } from '@/contexts/catalog/infra/persistence/album-model'
import { GenreMapper } from '@/contexts/catalog/infra/persistence/genre-mapper'
import type { Review } from '@/contexts/rating/domain/review'
import type {
  ChartAlbumRaw,
  PopularFilters,
  ReviewRepository,
  TopRatedFilters,
} from '@/contexts/rating/domain/review-repository'
import type { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { UserMapper } from '@/contexts/user/infra/persistence/user-mapper'
import type { UserData } from '@/contexts/user/infra/persistence/user-model'
import { ReviewMapper } from './review-mapper'
import {
  type ReviewData,
  ReviewModel,
  type ReviewPopulated,
} from './review-model'
import { buildPopularPipeline } from './review-popular.pipeline'
import { POPULATE_OPTIONS, resolveObjectIds } from './review-repository.helpers'
import {
  buildTopRatedPipeline,
  getGlobalAverageRating,
} from './review-top-rated.pipeline'

export class MongooseReviewRepository implements ReviewRepository {
  private readonly model = ReviewModel

  constructor(
    private readonly userModel: Model<UserData>,
    private readonly albumModel: Model<AlbumData>
  ) {}

  async save(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review)

    const ids = await resolveObjectIds(
      this.userModel,
      this.albumModel,
      review.id
    )

    if (!ids) {
      throw new Error('User or album not found')
    }

    const docToSave: ReviewData = {
      ...data,
      albumId: ids.albumId,
      userId: ids.userId,
    }

    const updated = await this.model
      .findOneAndUpdate(
        { albumId: ids.albumId, userId: ids.userId },
        docToSave,
        {
          new: true,
          upsert: true,
        }
      )
      .populate<ReviewPopulated>(POPULATE_OPTIONS)
      .lean()

    if (!updated) {
      throw new Error('Failed to save review')
    }

    return this.toDomainFromPopulated(updated)
  }

  async findById(id: ReviewId): Promise<Review | null> {
    const ids = await resolveObjectIds(this.userModel, this.albumModel, id)

    if (!ids) {
      return null
    }

    const doc = await this.model
      .findOne({ albumId: ids.albumId, userId: ids.userId })
      .populate<ReviewPopulated>(POPULATE_OPTIONS)
      .lean()

    return doc ? this.toDomainFromPopulated(doc) : null
  }

  async findByPublicId(publicId: PublicId): Promise<Review | null> {
    const doc = await this.model
      .findOne({ publicId: publicId.value })
      .populate<ReviewPopulated>(POPULATE_OPTIONS)
      .lean()

    return doc ? this.toDomainFromPopulated(doc) : null
  }

  async findByUser(
    userId: UserId,
    pagination?: Pagination
  ): Promise<PaginatedResult<Review>> {
    const user = await this.userModel
      .findOne({
        email: userId.email.value,
        username: userId.username.value,
      })
      .lean()

    if (!user) {
      return emptyPaginatedResult()
    }

    const userIdObj = user._id
    if (!userIdObj) {
      throw new Error('User _id is missing')
    }

    const result = await MongooseUtils.paginateFind<
      ReviewData,
      ReviewPopulated
    >(this.model, { userId: userIdObj }, pagination, { reviewedAt: -1 }, [
      ...POPULATE_OPTIONS,
    ])

    return {
      ...result,
      items: result.items.map((doc) => this.toDomainFromPopulated(doc)),
    }
  }

  async findByAlbum(
    albumId: AlbumId,
    pagination?: Pagination
  ): Promise<PaginatedResult<Review>> {
    const album = await this.albumModel
      .findOne({
        artist: albumId.artist.value,
        title: albumId.title.value,
      })
      .lean()

    if (!album) {
      return emptyPaginatedResult()
    }

    const albumIdObj = album._id
    if (!albumIdObj) {
      throw new Error('Album _id is missing')
    }

    const result = await MongooseUtils.paginateFind<
      ReviewData,
      ReviewPopulated
    >(this.model, { albumId: albumIdObj }, pagination, { reviewedAt: -1 }, [
      ...POPULATE_OPTIONS,
    ])

    return {
      ...result,
      items: result.items.map((doc) => this.toDomainFromPopulated(doc)),
    }
  }

  async findRecent(pagination?: Pagination): Promise<PaginatedResult<Review>> {
    const result = await MongooseUtils.paginateFind<
      ReviewData,
      ReviewPopulated
    >(this.model, {}, pagination, { reviewedAt: -1 }, [...POPULATE_OPTIONS])

    return {
      ...result,
      items: result.items.map((doc) => this.toDomainFromPopulated(doc)),
    }
  }

  async findTopRated(
    filters: TopRatedFilters,
    pagination?: Pagination
  ): Promise<PaginatedResult<ChartAlbumRaw>> {
    const globalAverageRating = await getGlobalAverageRating(this.model)
    const pipeline = buildTopRatedPipeline(filters, globalAverageRating)
    const result = await MongooseUtils.paginateAggregate(
      this.model,
      pipeline,
      pagination
    )

    return {
      ...result,
      items: result.items as unknown as ChartAlbumRaw[],
    }
  }

  async findMostReviewed(
    filters: PopularFilters,
    pagination?: Pagination
  ): Promise<PaginatedResult<ChartAlbumRaw>> {
    const pipeline = buildPopularPipeline(filters)
    const result = await MongooseUtils.paginateAggregate(
      this.model,
      pipeline,
      pagination
    )

    return {
      ...result,
      items: result.items as unknown as ChartAlbumRaw[],
    }
  }

  async delete(id: ReviewId): Promise<boolean> {
    const ids = await resolveObjectIds(this.userModel, this.albumModel, id)

    if (!ids) {
      return false
    }

    const result = await this.model.deleteOne({
      albumId: ids.albumId,
      userId: ids.userId,
    })

    return result.deletedCount > 0
  }

  private toDomainFromPopulated(doc: ReviewPopulated): Review {
    const user = UserMapper.toDomain(doc.userId)
    const genres = doc.albumId.genres.map(GenreMapper.toDomain)
    const album = AlbumMapper.toDomain(doc.albumId, genres)
    return ReviewMapper.toDomain(doc, user, album)
  }
}
