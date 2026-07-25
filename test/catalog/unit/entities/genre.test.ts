import { PublicId } from '@/contexts/!common/public-id'
import { unwrap } from '@/contexts/!common/result'
import { Genre } from '@/contexts/catalog/domain/genre'
import { GenreId } from '@/contexts/catalog/domain/value-objects/genre-id'
import { GenreName } from '@/contexts/catalog/domain/value-objects/genre-name'
import { GENRE, GENRE_SLUG } from '../fixtures'

describe('Genre', () => {
  describe('create', () => {
    function createGenre(name: string) {
      const genreName = unwrap(GenreName.create(name))
      return Genre.create({ id: GenreId.create(name), name: genreName })
    }

    test('creates with valid genre', () => {
      const genre = createGenre(GENRE)
      expect(genre.name.value).toBe(GENRE)
      expect(genre.slug).toBe(GENRE_SLUG)
    })

    test('trims whitespaces', () => {
      const genre = createGenre(`  ${GENRE}  `)
      expect(genre.name.value).toBe(GENRE)
    })

    test('normalizes slug to lowercase', () => {
      const genreName = unwrap(GenreName.create('ROCK'))
      const genre = Genre.create({
        id: GenreId.create('ROCK'),
        name: genreName,
      })
      expect(genre.name.value).toBe('ROCK')
      expect(genre.slug).toBe('rock')
    })

    test('assigns a PublicId instance', () => {
      const genre = createGenre(GENRE)
      expect(genre.publicId).toBeInstanceOf(PublicId)
    })
  })

  describe('fromPersistence', () => {
    test('rebuilds from persistence props', () => {
      const now = new Date()
      const genre = Genre.fromPersistence({
        createdAt: now,
        id: GenreId.unsafe('rock'),
        name: GenreName.unsafe('Rock'),
        publicId: PublicId.unsafe('test-public-id'),
        updatedAt: now,
      })

      expect(genre.slug).toBe('rock')
      expect(genre.name.value).toBe('Rock')
      expect(genre.publicId.value).toBe('test-public-id')
      expect(genre.getCreationDate().getTime()).toBe(now.getTime())
    })
  })

  describe('equals', () => {
    test('returns true for same id', () => {
      const now = new Date()
      const publicId = PublicId.unsafe('test')
      const g1 = Genre.fromPersistence({
        createdAt: now,
        id: GenreId.unsafe('rock'),
        name: GenreName.unsafe('Rock'),
        publicId,
        updatedAt: now,
      })
      const g2 = Genre.fromPersistence({
        createdAt: now,
        id: GenreId.unsafe('rock'),
        name: GenreName.unsafe('Pop'),
        publicId,
        updatedAt: now,
      })
      expect(g1.equals(g2)).toBeTruthy()
    })

    test('returns false for different ids', () => {
      const g1 = Genre.fromPersistence({
        createdAt: new Date(),
        id: GenreId.unsafe('rock'),
        name: GenreName.unsafe('Rock'),
        publicId: PublicId.unsafe('a'),
        updatedAt: new Date(),
      })
      const g2 = Genre.fromPersistence({
        createdAt: new Date(),
        id: GenreId.unsafe('pop'),
        name: GenreName.unsafe('Pop'),
        publicId: PublicId.unsafe('b'),
        updatedAt: new Date(),
      })
      expect(g1.equals(g2)).toBeFalsy()
    })
  })
})
