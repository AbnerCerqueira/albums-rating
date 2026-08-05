import { Album, FORMATS } from '@/contexts/catalog/domain/album'
import { Genre } from '@/contexts/catalog/domain/genre'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { CoverUrl } from '@/contexts/catalog/domain/value-objects/cover-url'
import { GenreName } from '@/contexts/catalog/domain/value-objects/genre-name'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { PublicId } from '@/contexts/shared/public-id'
import { ARTIST, FORMAT, GENRE, RELEASE_DATE, TITLE } from '../fixtures'
import { createAlbum, createGenre } from '../helpers'

describe('Album', () => {
  describe('create', () => {
    test('creates with all props', () => {
      const album = createAlbum()
      expect(album).toBeInstanceOf(Album)
    })

    test('sets createdAt and updatedAt close together on creation', () => {
      const album = createAlbum()
      const diff = Math.abs(
        album.getCreationDate().getTime() - album.getUpdateDate().getTime()
      )
      expect(diff).toBeLessThan(100)
    })

    test('assigns a PublicId instance', () => {
      const album = createAlbum()
      expect(album.publicId).toBeInstanceOf(PublicId)
    })

    test('creates with all required props', () => {
      const album = createAlbum()
      expect(album.id).toBeInstanceOf(AlbumId)
      expect(album.format).toBe(FORMAT)
      expect(Array.isArray(album.genres)).toBeTruthy()
      expect(album.genres[0]).toBeInstanceOf(Genre)
      expect(album.genres[0].name).toBeInstanceOf(GenreName)
      expect(album.releaseDate).toBeInstanceOf(ReleaseDate)
    })

    test('creates with different formats', () => {
      for (const format of FORMATS) {
        const album = createAlbum({ format })
        expect(album.format).toBe(format)
      }
    })
  })

  describe('fromPersistence', () => {
    test('rebuilds from persistence props', () => {
      const album = createAlbum()
      const restored = Album.fromPersistence({
        coverUrl: album.coverUrl,
        createdAt: album.getCreationDate(),
        format: album.format,
        genres: album.genres,
        id: album.id,
        publicId: album.publicId,
        releaseDate: album.releaseDate,
        updatedAt: album.getUpdateDate(),
      })

      expect(restored.id.equals(album.id)).toBeTruthy()
      expect(restored.publicId.value).toBe(album.publicId.value)
      expect(restored.format).toBe(album.format)
      expect(restored.genres[0].name.value).toBe(album.genres[0].name.value)
      expect(restored.coverUrl.value).toBe(album.coverUrl.value)
      expect(restored.releaseDate.value.getTime()).toBe(
        album.releaseDate.value.getTime()
      )
      expect(restored.getCreationDate().getTime()).toBe(
        album.getCreationDate().getTime()
      )
      expect(restored.getUpdateDate().getTime()).toBe(
        album.getUpdateDate().getTime()
      )
    })

    test('rebuilds with different timestamps', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id = AlbumId.create({ artist, title })
      const genre = createGenre()
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-06-15')

      const restored = Album.fromPersistence({
        coverUrl: CoverUrl.create('/covers/other.jpg'),
        createdAt,
        format: FORMAT,
        genres: [genre],
        id,
        publicId: PublicId.unsafe('fixed-public-id'),
        releaseDate,
        updatedAt,
      })

      expect(restored.getCreationDate().getTime()).toBe(createdAt.getTime())
      expect(restored.getUpdateDate().getTime()).toBe(updatedAt.getTime())
      expect(restored.getCreationDate().getTime()).not.toBe(
        restored.getUpdateDate().getTime()
      )
      expect(restored.publicId.value).toBe('fixed-public-id')
    })

    test('rebuilds with given publicId', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id = AlbumId.create({ artist, title })
      const genre = createGenre()
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)
      const now = new Date()

      const restored = Album.fromPersistence({
        coverUrl: CoverUrl.create('/covers/other.jpg'),
        createdAt: now,
        format: FORMAT,
        genres: [genre],
        id,
        publicId: PublicId.unsafe('fixed-public-id'),
        releaseDate,
        updatedAt: now,
      })

      expect(restored.publicId.value).toBe('fixed-public-id')
    })
  })

  describe('setCover', () => {
    test('returns a new album with the new coverUrl', () => {
      const album = createAlbum()
      const updated = album.setCover(CoverUrl.create('/covers/new.jpg'))

      expect(updated.coverUrl.value).toBe('/covers/new.jpg')
      expect(album.coverUrl.value).not.toBe('/covers/new.jpg')
    })

    test('keeps the original album unchanged', () => {
      const album = createAlbum()
      const originalCover = album.coverUrl.value
      album.setCover(CoverUrl.create('/covers/new.jpg'))

      expect(album.coverUrl.value).toBe(originalCover)
    })

    test('updates updatedAt', () => {
      const album = createAlbum()
      const updated = album.setCover(CoverUrl.create('/covers/new.jpg'))

      expect(updated.getUpdateDate().getTime()).toBeGreaterThanOrEqual(
        album.getUpdateDate().getTime()
      )
      expect(updated.getCreationDate().getTime()).toBe(
        album.getCreationDate().getTime()
      )
    })

    test('keeps the same publicId and id', () => {
      const album = createAlbum()
      const updated = album.setCover(CoverUrl.create('/covers/new.jpg'))

      expect(updated.publicId.value).toBe(album.publicId.value)
      expect(updated.id.equals(album.id)).toBeTruthy()
    })
  })

  describe('getters', () => {
    test('id returns title and artist', () => {
      const album = createAlbum()
      expect(album.id.title.value).toBe(TITLE)
      expect(album.id.artist.value).toBe(ARTIST)
    })

    test('publicId is a slug based on artist and title', () => {
      const album = createAlbum()
      expect(album.publicId.value).toBe('artista-teste-album-teste')
    })

    test('getCreationDate returns a copy', () => {
      const album = createAlbum()
      const date = album.getCreationDate()
      date.setFullYear(2000)
      expect(album.getCreationDate().getTime()).not.toBe(date.getTime())
    })

    test('getUpdateDate returns a copy', () => {
      const album = createAlbum()
      const date = album.getUpdateDate()
      date.setFullYear(2000)
      expect(album.getUpdateDate().getTime()).not.toBe(date.getTime())
    })

    test('genres returns correct values', () => {
      const album = createAlbum()
      expect(album.genres[0].name.value).toBe(GENRE)
    })

    test('releaseDate returns correct value', () => {
      const album = createAlbum()
      expect(album.releaseDate.value.getTime()).toBe(RELEASE_DATE.getTime())
    })
  })

  describe('equals', () => {
    test('returns true for same id', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id = AlbumId.create({ artist, title })
      const genre = createGenre()
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)

      const album1 = Album.create({
        coverUrl: CoverUrl.create('/covers/a.jpg'),
        format: FORMAT,
        genres: [genre],
        id,
        releaseDate,
      })
      const album2 = Album.create({
        coverUrl: CoverUrl.create('/covers/b.jpg'),
        format: FORMAT,
        genres: [genre],
        id,
        releaseDate,
      })

      expect(album1.equals(album2)).toBeTruthy()
    })

    test('returns true when comparing to itself', () => {
      const album = createAlbum()
      expect(album.equals(album)).toBeTruthy()
    })

    test('returns false for different ids', () => {
      const album1 = createAlbum({
        id: AlbumId.create({
          artist: Artist.unsafe(ARTIST),
          title: Title.unsafe('Título Diferente'),
        }),
      })
      const album2 = createAlbum()

      expect(album1.equals(album2)).toBeFalsy()
    })

    test('returns true when id matches but other props differ', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id = AlbumId.create({ artist, title })

      const album1 = Album.create({
        coverUrl: CoverUrl.create('/covers/a.jpg'),
        format: 'LP',
        genres: [createGenre({ name: 'Rock', slug: 'rock' })],
        id,
        releaseDate: ReleaseDate.unsafe(new Date('2020-01-01')),
      })
      const album2 = Album.create({
        coverUrl: CoverUrl.create('/covers/b.jpg'),
        format: 'EP',
        genres: [createGenre({ name: 'Pop', slug: 'pop' })],
        id,
        releaseDate: ReleaseDate.unsafe(new Date('2024-06-15')),
      })

      expect(album1.equals(album2)).toBeTruthy()
    })
  })
})
