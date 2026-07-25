import { model, Schema, type Types } from 'mongoose'
import type { AlbumPopulated } from '@/contexts/catalog/infra/persistence/album-model'
import type { UserData } from '@/contexts/user/infra/persistence/user-model'

export type ReviewData = {
  userId: Types.ObjectId
  albumId: Types.ObjectId
  publicId: string
  isFavorite: boolean
  isEdited: boolean
  rating: number
  reviewText: string | null
  reviewedAt: Date
  createdAt: Date
  updatedAt: Date
}

export type ReviewPopulated = Omit<ReviewData, 'userId' | 'albumId'> & {
  userId: UserData
  albumId: AlbumPopulated
}

export type ReviewPersistenceData = Omit<ReviewData, 'userId' | 'albumId'> & {
  userId: string
  albumId: string
}

const reviewSchema = new Schema<ReviewData>(
  {
    albumId: { ref: 'albums', required: true, type: Schema.Types.ObjectId },
    isEdited: {
      default: false,
      required: true,
      type: Boolean,
    },
    isFavorite: {
      default: false,
      required: true,
      type: Boolean,
    },
    publicId: {
      index: true,
      required: true,
      type: String,
      unique: true,
    },
    rating: {
      max: 5,
      min: 0,
      required: true,
      type: Number,
    },
    reviewedAt: {
      required: true,
      type: Date,
    },
    reviewText: {
      required: false,
      type: String,
    },
    userId: { ref: 'users', required: true, type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

reviewSchema.index({ albumId: 1, userId: 1 }, { unique: true })

export const ReviewModel = model('reviews', reviewSchema)
