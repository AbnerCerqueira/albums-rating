import { model, Schema } from 'mongoose'

export type ReviewDataDomainId = {
  userEmail: string
  username: string
  albumTitle: string
  albumArtist: string
}

export type ReviewData = {
  domainId: ReviewDataDomainId
  publicId: string
  isFavorite: boolean
  isEdited: boolean
  rating: number
  reviewedAt: Date
}

const reviewSchema = new Schema<ReviewData>(
  {
    domainId: {
      albumArtist: String,
      albumTitle: String,
      userEmail: String,
      username: String,
    },
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
      max: 10,
      min: 1,
      required: true,
      type: Number,
    },
    reviewedAt: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
    toObject: {
      // biome-ignore lint/suspicious/noExplicitAny: faz sentido
      transform(_, ret: any) {
        const obj = ret
        obj.id = obj._id.toString()
        return obj
      },
    },
    versionKey: false,
  }
)

reviewSchema.index(
  {
    'domainId.albumArtist': 1,
    'domainId.albumTitle': 1,
    'domainId.userEmail': 1,
    'domainId.username': 1,
  },
  { unique: true }
)

export const ReviewModel = model('reviews', reviewSchema)
