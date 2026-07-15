import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'

export const RATING = 4.5
export const REVIEW_TEXT = 'Um álbum excelente!'
export const REVIEWED_AT = new Date('2025-12-15')

export const USER_EMAIL = 'user@test.com'
export const USERNAME_VALUE = 'usertest'
export const ALBUM_TITLE = 'Álbum Teste'
export const ALBUM_ARTIST = 'Artista Teste'

export function createTestUserId(
  email = USER_EMAIL,
  username = USERNAME_VALUE
): UserId {
  return UserId.create({
    email: Email.unsafe(email),
    username: Username.unsafe(username),
  })
}

export function createTestAlbumId(
  title = ALBUM_TITLE,
  artist = ALBUM_ARTIST
): AlbumId {
  return AlbumId.create({
    artist: Artist.unsafe(artist),
    title: Title.unsafe(title),
  })
}
