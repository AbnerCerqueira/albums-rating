import { Album, type AlbumProps } from '@/contexts/catalog/domain/album'
import { Genre } from '@/contexts/catalog/domain/genre'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { CoverUrl } from '@/contexts/catalog/domain/value-objects/cover-url'
import { GenreId } from '@/contexts/catalog/domain/value-objects/genre-id'
import { GenreName } from '@/contexts/catalog/domain/value-objects/genre-name'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import {
  ARTIST,
  COVER_URL,
  FORMAT,
  GENRE,
  GENRE_SLUG,
  RELEASE_DATE,
  TITLE,
} from './fixtures'

export function createGenre(overrides?: {
  name?: string
  slug?: string
}): Genre {
  return Genre.create({
    id: GenreId.unsafe(overrides?.slug ?? GENRE_SLUG),
    name: GenreName.unsafe(overrides?.name ?? GENRE),
  })
}

export function createAlbum(overrides?: Partial<AlbumProps>): Album {
  const title = Title.unsafe(TITLE)
  const artist = Artist.unsafe(ARTIST)
  const id = overrides?.id ?? AlbumId.create({ artist, title })
  const format = overrides?.format ?? FORMAT
  const genres = overrides?.genres ?? [createGenre()]
  const releaseDate =
    overrides?.releaseDate ?? ReleaseDate.unsafe(new Date(RELEASE_DATE))
  const coverUrl = overrides?.coverUrl ?? CoverUrl.create(COVER_URL)

  return Album.create({ coverUrl, format, genres, id, releaseDate })
}
