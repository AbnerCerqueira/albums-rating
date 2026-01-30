import type { Album, Format } from '../domain/album'

export type AlbumDTO = {
  publicId: string
  title: string
  artist: string
  releaseDate: string
  genre: string
  format: Format
}

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
    releaseDate: releaseDate.toISOString(),
  }
}

export const AlbumDTOMapper = { toDTO }
