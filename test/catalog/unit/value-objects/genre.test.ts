import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Genre } from '@/contexts/catalog/domain/value-objects/genre'
import { GENRE } from '../fixtures'

describe('Genre', () => {
  describe('create', () => {
    test('creates with valid genre', () => {
      const result = unwrap(Genre.create(GENRE))
      expect(result.value).toBe(GENRE)
    })

    test('trims whitespaces', () => {
      const result = unwrap(Genre.create(`  ${GENRE}  `))
      expect(result.value).toBe(GENRE)
    })

    test('returns error for empty genre', () => {
      expect(() => unwrap(Genre.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only genre', () => {
      expect(() => unwrap(Genre.create('   '))).toThrow(InvalidArgumentError)
    })

    test('does not normalize case', () => {
      const result = unwrap(Genre.create(GENRE.toUpperCase()))
      expect(result.value).toBe(GENRE.toUpperCase())
    })
  })

  describe('unsafe', () => {
    test('creates without validation', () => {
      const g = Genre.unsafe('Custom Genre')
      expect(g.value).toBe('Custom Genre')
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const g1 = Genre.unsafe(GENRE)
      const g2 = Genre.unsafe(GENRE)
      expect(g1.equals(g2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const g1 = Genre.unsafe(GENRE)
      const g2 = Genre.unsafe('Pop')
      expect(g1.equals(g2)).toBeFalsy()
    })
  })
})
