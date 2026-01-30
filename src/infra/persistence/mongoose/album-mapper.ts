import { Album, type AlbumProps } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { PublicId } from '@/contexts/common/public-id'
import type { AlbumData } from './album-model'

function toPersistence(album: Album): AlbumData {
  const { id, props, publicId } = album
  const { artist, title } = id
  const { format, genre, releaseDate } = props

  return {
    domainId: {
      artist,
      title: title.value,
    },
    format,
    genre,
    publicId: publicId.toString(),
    releaseDate,
  }
}

function toDomain(data: AlbumData): Album {
  const { domainId, format, genre, publicId, releaseDate } = data

  const albumId = new AlbumId(
    Title.unsafeCreate(domainId.title),
    domainId.artist
  )
  const albumProps: AlbumProps = { format, genre, releaseDate }
  return new Album(albumId, albumProps, new PublicId(publicId))
}

export const AlbumMapper = { toPersistence, toDomain }
