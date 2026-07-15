import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { Review } from '@/contexts/rating/domain/review'
import type { ReviewRepository } from '@/contexts/rating/domain/review-repository'
import type { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { ReviewMapper } from './review-mapper'
import { ReviewModel } from './review-model'

export class MongooseReviewRepository implements ReviewRepository {
  private readonly model = ReviewModel

  async save(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review)
    const filter = this.getFlattenObjOfDomainId(review.id)
    const updated = await this.model
      .findOneAndUpdate(filter, data, {
        new: true,
        upsert: true,
      })
      .lean()

    return ReviewMapper.toDomain(updated)
  }

  async findById(id: ReviewId): Promise<Review | null> {
    const foundReview = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundReview ? ReviewMapper.toDomain(foundReview) : null
  }

  async findByPublicId(publicId: PublicId): Promise<Review | null> {
    const doc = await this.model.findOne({ publicId: publicId.value }).lean()

    return doc ? ReviewMapper.toDomain(doc) : null
  }

  async findByUser(userId: UserId, pagination?: Pagination): Promise<Review[]> {
    const query = this.model.find({
      'domainId.userEmail': userId.email.value,
      'domainId.username': userId.username.value,
    })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.sort({ reviewedAt: -1 }).lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  async findByAlbum(
    albumId: AlbumId,
    pagination?: Pagination
  ): Promise<Review[]> {
    const query = this.model.find({
      'domainId.albumArtist': albumId.artist.value,
      'domainId.albumTitle': albumId.title.value,
    })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.sort({ reviewedAt: -1 }).lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  async findRecent(pagination?: Pagination): Promise<Review[]> {
    const query = this.model.find().sort({ reviewedAt: -1 })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  async delete(id: ReviewId): Promise<boolean> {
    const result = await this.model.deleteOne(this.getFlattenObjOfDomainId(id))
    return result.deletedCount > 0
  }

  private getFlattenObjOfDomainId(id: ReviewId) {
    return {
      'domainId.albumArtist': id.albumId.artist.value,
      'domainId.albumTitle': id.albumId.title.value,
      'domainId.userEmail': id.userId.email.value,
      'domainId.username': id.userId.username.value,
    }
  }
}
