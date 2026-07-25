import z from 'zod'
import { FORMATS } from '@/contexts/catalog/domain/album'
import type { TopRatedAlbumRaw } from '../domain/review-repository'

export const zodTopAlbumDTO = z.object({
  artist: z.string(),
  averageRating: z.number(),
  format: z.enum(FORMATS),
  genres: z.array(z.string()),
  publicId: z.string(),
  releaseDate: z.iso.date(),
  reviewCount: z.number(),
  title: z.string(),
})

export type TopAlbumDTO = z.infer<typeof zodTopAlbumDTO>

function toDTO(raw: TopRatedAlbumRaw): TopAlbumDTO {
  return {
    artist: raw.artist,
    averageRating: raw.averageRating,
    format: raw.format as TopAlbumDTO['format'],
    genres: raw.genres,
    publicId: raw.publicId,
    releaseDate: raw.releaseDate.toISOString().split('T')[0],
    reviewCount: raw.reviewCount,
    title: raw.title,
  }
}

export const TopAlbumDTOMapper = { toDTO }
