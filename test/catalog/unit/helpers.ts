import { Album, type AlbumProps } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Genre } from '@/contexts/catalog/domain/value-objects/genre'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { ARTIST, FORMAT, GENRE, RELEASE_DATE, TITLE } from './fixtures'

export function createAlbum(overrides?: Partial<AlbumProps>): Album {
  const title = Title.unsafe(TITLE)
  const artist = Artist.unsafe(ARTIST)
  const id = overrides?.id ?? AlbumId.create({ artist, title })
  const format = overrides?.format ?? FORMAT
  const genre = overrides?.genre ?? Genre.unsafe(GENRE)
  const releaseDate =
    overrides?.releaseDate ?? ReleaseDate.unsafe(new Date(RELEASE_DATE))

  return Album.create({ format, genre, id, releaseDate })
}
