import z from 'zod'
import { type Album, FORMATS } from '../domain/album'

export const zodAlbumDTO = z.object({
  artist: z.string(),
  format: z.enum(FORMATS),
  genres: z.array(z.string()),
  publicId: z.string(),
  releaseDate: z.iso.date(),
  title: z.string(),
})

export type AlbumDTO = z.infer<typeof zodAlbumDTO>

function toDTO(album: Album): AlbumDTO {
  return {
    artist: album.id.artist.value,
    format: album.format,
    genres: album.genres.map((g) => g.name.value),
    publicId: album.publicId.value,
    releaseDate: album.releaseDate.value.toISOString().split('T')[0],
    title: album.id.title.value,
  }
}

export const AlbumDTOMapper = { toDTO }
