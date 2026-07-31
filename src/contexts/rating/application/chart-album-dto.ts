import z from 'zod'
import { FORMATS } from '@/contexts/catalog/domain/album'
import type { ChartAlbumRaw } from '../domain/types/chart-types'

export const zodChartAlbumDTO = z.object({
  artist: z.string(),
  averageRating: z.number(),
  format: z.enum(FORMATS),
  genres: z.array(z.string()),
  publicId: z.string(),
  releaseDate: z.iso.date(),
  reviewCount: z.number(),
  title: z.string(),
})

export type ChartAlbumDTO = z.infer<typeof zodChartAlbumDTO>

function toDTO(raw: ChartAlbumRaw): ChartAlbumDTO {
  return {
    artist: raw.artist,
    averageRating: raw.averageRating,
    format: raw.format as ChartAlbumDTO['format'],
    genres: raw.genres,
    publicId: raw.publicId,
    releaseDate: raw.releaseDate.toISOString().split('T')[0],
    reviewCount: raw.reviewCount,
    title: raw.title,
  }
}

export const ChartAlbumDTOMapper = { toDTO }
