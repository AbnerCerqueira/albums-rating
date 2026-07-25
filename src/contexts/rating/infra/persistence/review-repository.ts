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
import type { ReviewRepository } from '@/contexts/rating/domain/review-repository'
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

export class MongooseReviewRepository implements ReviewRepository {
  private readonly model = ReviewModel

  constructor(
    private readonly userModel: Model<UserData>,
    private readonly albumModel: Model<AlbumData>
  ) {}

  async save(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review)

    const email = review.id.userId.email.value
    const username = review.id.userId.username.value
    const artist = review.id.albumId.artist.value
    const title = review.id.albumId.title.value

    const [user, album] = await Promise.all([
      this.userModel.findOne({ email, username }).lean(),
      this.albumModel.findOne({ artist, title }).lean(),
    ])

    if (!(user && album)) {
      throw new Error('User or album not found')
    }

    const userId = user._id
    if (!userId) {
      throw new Error('User _id is missing')
    }

    const albumId = album._id
    if (!albumId) {
      throw new Error('Album _id is missing')
    }

    const docToSave: ReviewData = {
      ...data,
      albumId,
      userId,
    }

    const updated = await this.model
      .findOneAndUpdate({ albumId, userId }, docToSave, {
        new: true,
        upsert: true,
      })
      .populate<ReviewPopulated>([
        { path: 'albumId', populate: { path: 'genres' } },
        'userId',
      ])
      .lean()

    if (!updated) {
      throw new Error('Failed to save review')
    }

    return this.toDomainFromPopulated(updated)
  }

  async findById(id: ReviewId): Promise<Review | null> {
    const [user, album] = await Promise.all([
      this.userModel
        .findOne({
          email: id.userId.email.value,
          username: id.userId.username.value,
        })
        .lean(),
      this.albumModel
        .findOne({
          artist: id.albumId.artist.value,
          title: id.albumId.title.value,
        })
        .lean(),
    ])

    if (!(user && album)) {
      return null
    }

    const userId = user._id
    if (!userId) {
      throw new Error('User _id is missing')
    }

    const albumId = album._id
    if (!albumId) {
      throw new Error('Album _id is missing')
    }

    const doc = await this.model
      .findOne({ albumId, userId })
      .populate<ReviewPopulated>([
        { path: 'albumId', populate: { path: 'genres' } },
        'userId',
      ])
      .lean()

    if (!doc) {
      return null
    }

    return this.toDomainFromPopulated(doc)
  }

  async findByPublicId(publicId: PublicId): Promise<Review | null> {
    const doc = await this.model
      .findOne({ publicId: publicId.value })
      .populate<ReviewPopulated>([
        { path: 'albumId', populate: { path: 'genres' } },
        'userId',
      ])
      .lean()

    if (!doc) {
      return null
    }

    return this.toDomainFromPopulated(doc)
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
      { path: 'albumId', populate: { path: 'genres' } },
      'userId',
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
      { path: 'albumId', populate: { path: 'genres' } },
      'userId',
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
    >(this.model, {}, pagination, { reviewedAt: -1 }, [
      { path: 'albumId', populate: { path: 'genres' } },
      'userId',
    ])

    return {
      ...result,
      items: result.items.map((doc) => this.toDomainFromPopulated(doc)),
    }
  }

  async delete(id: ReviewId): Promise<boolean> {
    const [user, album] = await Promise.all([
      this.userModel
        .findOne({
          email: id.userId.email.value,
          username: id.userId.username.value,
        })
        .lean(),
      this.albumModel
        .findOne({
          artist: id.albumId.artist.value,
          title: id.albumId.title.value,
        })
        .lean(),
    ])

    if (!(user && album)) {
      return false
    }

    const userId = user._id
    if (!userId) {
      throw new Error('User _id is missing')
    }

    const albumId = album._id
    if (!albumId) {
      throw new Error('Album _id is missing')
    }

    const result = await this.model.deleteOne({ albumId, userId })

    return result.deletedCount > 0
  }

  private toDomainFromPopulated(doc: ReviewPopulated): Review {
    const user = UserMapper.toDomain(doc.userId)
    const genres = doc.albumId.genres.map(GenreMapper.toDomain)
    const album = AlbumMapper.toDomain(doc.albumId, genres)
    return ReviewMapper.toDomain(doc, user, album)
  }
}
