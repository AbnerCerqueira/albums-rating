import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { Review } from '@/contexts/rating/domain/review'
import type { ReviewRepository } from '@/contexts/rating/domain/review-repository'
import type { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { ReviewMapper } from './review-mapper'
import { type ReviewDataDomainId, ReviewModel } from './review-model'

export class MongooseReviewRepository implements ReviewRepository {
  private readonly model = ReviewModel

  public async create(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review)
    const newReview = await this.model.create(data)

    return ReviewMapper.toDomain(newReview.toObject())
  }

  public async findById(id: ReviewId): Promise<Review | null> {
    const foundReview = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundReview ? ReviewMapper.toDomain(foundReview) : null
  }

  public async findByPublicId(publicId: PublicId): Promise<Review | null> {
    const doc = await this.model
      .findOne({ publicId: publicId.toString() })
      .lean()

    return doc ? ReviewMapper.toDomain(doc) : null
  }

  public async findByUser(
    userId: UserId,
    pagination?: Pagination
  ): Promise<Review[]> {
    const query = this.model.find({
      'domainId.userEmail': userId.email.value,
      'domainId.username': userId.username.value,
    })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.sort({ reviewedAt: -1 }).lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  public async findByAlbum(
    albumId: AlbumId,
    pagination?: Pagination
  ): Promise<Review[]> {
    const query = this.model.find({
      'domainId.albumArtist': albumId.artist,
      'domainId.albumTitle': albumId.title.value,
    })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.sort({ reviewedAt: -1 }).lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  public async findRecent(pagination?: Pagination): Promise<Review[]> {
    const query = this.model.find().sort({ reviewedAt: -1 })

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.lean()

    return docs.map((doc) => ReviewMapper.toDomain(doc))
  }

  public async update(review: Review): Promise<Review | null> {
    const data = ReviewMapper.toPersistence(review)
    const updatedReview = await this.model
      .findOneAndUpdate(
        this.getFlattenObjOfDomainId(review.id),
        { $set: data },
        { new: true }
      )
      .lean()

    return updatedReview ? ReviewMapper.toDomain(updatedReview) : null
  }

  public async delete(id: ReviewId): Promise<boolean> {
    const result = await this.model.deleteOne(this.getFlattenObjOfDomainId(id))
    return result.deletedCount > 0
  }

  private getFlattenObjOfDomainId(id: ReviewId) {
    const domainId: ReviewDataDomainId = {
      albumArtist: id.albumId.artist,
      albumTitle: id.albumId.title.value,
      userEmail: id.userId.email.value,
      username: id.userId.username.value,
    }

    return {
      'domainId.albumArtist': domainId.albumArtist,
      'domainId.albumTitle': domainId.albumTitle,
      'domainId.userEmail': domainId.userEmail,
      'domainId.username': domainId.username,
    }
  }
}
