import type { Types } from 'mongoose'

export const REVIEWS_COLLECTION = 'reviews' as const

export type AlbumChartSourceReview = {
  albumId: Types.ObjectId
  rating: number
}
