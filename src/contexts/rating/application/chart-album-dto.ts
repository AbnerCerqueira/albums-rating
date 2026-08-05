import z from 'zod'
import { FORMATS } from '@/contexts/catalog/domain/album'
import type { ChartAlbumProjection } from '@/contexts/shared/chart-types'

export const zodChartAlbumDTO = z.object({
  artist: z.string(),
  averageRating: z.number(),
  coverUrl: z.string(),
  format: z.enum(FORMATS),
  genres: z.array(z.string()),
  publicId: z.string(),
  releaseDate: z.iso.date(),
  reviewCount: z.number(),
  title: z.string(),
})

export type ChartAlbumDTO = z.infer<typeof zodChartAlbumDTO>

function toDTO(raw: ChartAlbumProjection): ChartAlbumDTO {
  return {
    artist: raw.artist,
    averageRating: Number.parseFloat(raw.averageRating.toFixed(2)),
    coverUrl: raw.coverUrl,
    format: raw.format as ChartAlbumDTO['format'],
    genres: raw.genres,
    publicId: raw.publicId,
    releaseDate: raw.releaseDate.toISOString().split('T')[0],
    reviewCount: raw.reviewCount,
    title: raw.title,
  }
}

export const ChartAlbumDTOMapper = { toDTO }
