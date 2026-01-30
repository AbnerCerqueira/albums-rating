import z from 'zod'
import { type Album, FORMATS } from '../domain/album'

export const zodAlbumDTO = z.object({
  publicId: z.uuidv7(),
  title: z.string(),
  artist: z.string(),
  releaseDate: z.iso.date(),
  genre: z.string(),
  format: z.enum(FORMATS),
})

export type AlbumDTO = z.infer<typeof zodAlbumDTO>

function toDTO(album: Album): AlbumDTO {
  const { id, props, publicId } = album
  const { artist, title } = id
  const { format, genre, releaseDate } = props

  return {
    artist,
    title: title.value,
    format,
    genre,
    publicId: publicId.toString(),
    releaseDate: releaseDate.toISOString().split('T')[0],
  }
}

export const AlbumDTOMapper = { toDTO }
