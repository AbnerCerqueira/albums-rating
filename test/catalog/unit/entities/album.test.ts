import { PublicId } from '@/contexts/!common/public-id'
import { Album, FORMATS } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Genre } from '@/contexts/catalog/domain/value-objects/genre'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { ARTIST, FORMAT, GENRE, RELEASE_DATE, TITLE } from '../fixtures'
import { createAlbum } from '../helpers'

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
      expect(album.genre).toBeInstanceOf(Genre)
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
        createdAt: album.getCreationDate(),
        format: album.format,
        genre: album.genre,
        id: album.id,
        publicId: album.publicId,
        releaseDate: album.releaseDate,
        updatedAt: album.getUpdateDate(),
      })

      expect(restored.id.equals(album.id)).toBeTruthy()
      expect(restored.publicId.value).toBe(album.publicId.value)
      expect(restored.format).toBe(album.format)
      expect(restored.genre.value).toBe(album.genre.value)
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
      const genre = Genre.unsafe(GENRE)
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-06-15')

      const restored = Album.fromPersistence({
        createdAt,
        format: FORMAT,
        genre,
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
      const genre = Genre.unsafe(GENRE)
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)
      const now = new Date()

      const restored = Album.fromPersistence({
        createdAt: now,
        format: FORMAT,
        genre,
        id,
        publicId: PublicId.unsafe('fixed-public-id'),
        releaseDate,
        updatedAt: now,
      })

      expect(restored.publicId.value).toBe('fixed-public-id')
    })
  })

  describe('getters', () => {
    test('id returns title and artist', () => {
      const album = createAlbum()
      expect(album.id.title.value).toBe(TITLE)
      expect(album.id.artist.value).toBe(ARTIST)
    })

    test('publicId is unique per album', () => {
      const album1 = createAlbum()
      const album2 = createAlbum()
      expect(album1.publicId.value).not.toBe(album2.publicId.value)
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

    test('genre returns correct value', () => {
      const album = createAlbum()
      expect(album.genre.value).toBe(GENRE)
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
      const genre = Genre.unsafe(GENRE)
      const releaseDate = ReleaseDate.unsafe(RELEASE_DATE)

      const album1 = Album.create({ format: FORMAT, genre, id, releaseDate })
      const album2 = Album.create({ format: FORMAT, genre, id, releaseDate })

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
        format: 'LP',
        genre: Genre.unsafe('Rock'),
        id,
        releaseDate: ReleaseDate.unsafe(new Date('2020-01-01')),
      })
      const album2 = Album.create({
        format: 'EP',
        genre: Genre.unsafe('Pop'),
        id,
        releaseDate: ReleaseDate.unsafe(new Date('2024-06-15')),
      })

      expect(album1.equals(album2)).toBeTruthy()
    })
  })
})
