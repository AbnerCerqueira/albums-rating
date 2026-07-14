import { PublicId } from '@/contexts/!common/public-id'
import { Album } from '@/contexts/catalog/domain/album'
import type { SearchAlbumParams } from '@/contexts/catalog/domain/album-repository'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Genre } from '@/contexts/catalog/domain/value-objects/genre'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import type { AlbumData } from './album-model'

function toPersistence(album: Album): AlbumData {
  return {
    createdAt: album.getCreationDate(),
    domainId: {
      artist: album.id.artist.value,
      title: album.id.title.value,
    },
    format: album.format,
    genre: album.genre.value,
    publicId: album.publicId.value,
    releaseDate: album.releaseDate.value,
    updatedAt: album.getUpdateDate(),
  }
}

function toDomain(data: AlbumData): Album {
  const {
    createdAt,
    domainId,
    format,
    genre,
    publicId,
    releaseDate,
    updatedAt,
  } = data

  const albumId = AlbumId.create({
    artist: Artist.unsafe(domainId.artist),
    title: Title.unsafe(domainId.title),
  })

  return Album.fromPersistence({
    createdAt: new Date(createdAt),
    format,
    genre: Genre.unsafe(genre),
    id: albumId,
    publicId: PublicId.unsafe(publicId),
    releaseDate: ReleaseDate.unsafe(new Date(releaseDate)),
    updatedAt: new Date(updatedAt),
  })
}

function toPersistenceSearchFields(
  params: SearchAlbumParams
): Record<string, string | string[]> {
  const fields: Record<string, string | string[]> = {}

  if (params.artist) {
    fields['domainId.artist'] = params.artist
  }

  if (params.genre) {
    fields.genre = params.genre
  }

  if (params.title) {
    fields['domainId.title'] = params.title
  }

  if (params.format?.length) {
    fields.format = params.format
  }

  return fields
}

export const AlbumMapper = {
  toDomain,
  toPersistence,
  toPersistenceSearchFields,
}
