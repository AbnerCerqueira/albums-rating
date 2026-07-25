import { PublicId } from '@/contexts/!common/public-id'
import { Album } from '@/contexts/catalog/domain/album'
import type { SearchAlbumParams } from '@/contexts/catalog/domain/album-repository'
import type { Genre } from '@/contexts/catalog/domain/genre'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import type { AlbumData } from './album-model'

type AlbumDataFields = Omit<AlbumData, 'genres'>

function toPersistence(album: Album): AlbumData {
  return {
    artist: album.id.artist.value,
    createdAt: album.getCreationDate(),
    format: album.format,
    genres: [],
    publicId: album.publicId.value,
    releaseDate: album.releaseDate.value,
    title: album.id.title.value,
    updatedAt: album.getUpdateDate(),
  }
}

function toDomain(data: AlbumDataFields, genres: Genre[]): Album {
  const { artist, title, createdAt, format, publicId, releaseDate, updatedAt } =
    data

  const albumId = AlbumId.create({
    artist: Artist.unsafe(artist),
    title: Title.unsafe(title),
  })

  return Album.fromPersistence({
    createdAt: new Date(createdAt),
    format,
    genres,
    id: albumId,
    publicId: PublicId.unsafe(publicId),
    releaseDate: ReleaseDate.unsafe(new Date(releaseDate)),
    updatedAt: new Date(updatedAt),
  })
}

function toPersistenceSearchFields(
  params: SearchAlbumParams
): Record<string, string> {
  const fields: Record<string, string> = {}

  if (params.artist) {
    fields.artist = params.artist
  }

  if (params.title) {
    fields.title = params.title
  }

  return fields
}

export const AlbumMapper = {
  toDomain,
  toPersistence,
  toPersistenceSearchFields,
}
