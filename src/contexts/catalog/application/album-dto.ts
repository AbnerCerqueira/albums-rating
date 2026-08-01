import z from 'zod'
import { type Album, FORMATS } from '../domain/album'

export const zodAlbumDTO = z.object({
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

export type AlbumDTO = z.infer<typeof zodAlbumDTO>

export type AlbumReviewCounts = { averageRating: number; reviewCount: number }

function toDTO(album: Album, chart: AlbumReviewCounts): AlbumDTO {
  return {
    artist: album.id.artist.value,
    averageRating: Number.parseFloat(chart.averageRating.toFixed(2)),
    coverUrl: album.coverUrl.value,
    format: album.format,
    genres: album.genres.map((g) => g.name.value),
    publicId: album.publicId.value,
    releaseDate: album.releaseDate.value.toISOString().split('T')[0],
    reviewCount: chart.reviewCount,
    title: album.id.title.value,
  }
}

export const AlbumDTOMapper = { toDTO }
