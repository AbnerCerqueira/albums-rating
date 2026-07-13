import z from 'zod'
import { type Album, FORMATS } from '../domain/album'

export const zodAlbumDTO = z.object({
  artist: z.string(),
  format: z.enum(FORMATS),
  genre: z.string(),
  publicId: z.uuidv7(),
  releaseDate: z.iso.date(),
  title: z.string(),
})

export type AlbumDTO = z.infer<typeof zodAlbumDTO>

function toDTO(album: Album): AlbumDTO {
  const { id, props, publicId } = album
  const { artist, title } = id
  const { format, genre, releaseDate } = props

  return {
    artist,
    format,
    genre,
    publicId: publicId.toString(),
    releaseDate: releaseDate.toISOString().split('T')[0],
    title: title.value,
  }
}

export const AlbumDTOMapper = { toDTO }
