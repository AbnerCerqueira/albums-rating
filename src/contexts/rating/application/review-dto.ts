import z from 'zod'
import type { Review } from '../domain/review'

export const zodReviewDTO = z.object({
  albumArtist: z.string(),
  albumTitle: z.string(),
  isEdited: z.boolean(),
  isFavorite: z.boolean(),
  publicId: z.string(),
  rating: z.number(),
  reviewedAt: z.iso.date(),
  reviewText: z.string().nullable(),
  username: z.string(),
})

export type ReviewDTO = z.infer<typeof zodReviewDTO>

function toDTO(review: Review): ReviewDTO {
  return {
    albumArtist: review.id.albumId.artist.value,
    albumTitle: review.id.albumId.title.value,
    isEdited: review.isEdited,
    isFavorite: review.isFavorite,
    publicId: review.publicId.value,
    rating: review.rating.value,
    reviewedAt: review.reviewedAt.value.toISOString().split('T')[0],
    reviewText: review.reviewText ? review.reviewText.value : null,
    username: review.id.userId.username.value,
  }
}

export const ReviewDTOMapper = { toDTO }
