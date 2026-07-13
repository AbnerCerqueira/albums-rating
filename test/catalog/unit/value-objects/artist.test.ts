import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { ARTIST } from '../fixtures'

describe('Artist', () => {
  describe('create', () => {
    test('creates with valid title', () => {
      const result = unwrap(Artist.create(ARTIST))
      expect(result.value).toBe(ARTIST)
    })

    test('trims whitespaces', () => {
      const result = unwrap(Artist.create(`  ${ARTIST}  `))
      expect(result.value).toBe(ARTIST)
    })

    test('returns error for empty title', () => {
      expect(() => unwrap(Artist.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only title', () => {
      expect(() => unwrap(Artist.create('   '))).toThrow(InvalidArgumentError)
    })

    test('does not normalize case', () => {
      const result = unwrap(Artist.create(ARTIST.toUpperCase()))
      expect(result.value).toBe(ARTIST.toUpperCase())
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const at1 = Artist.unsafe(ARTIST)
      const at2 = Artist.unsafe(ARTIST)
      expect(at1.equals(at2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const at1 = Artist.unsafe(ARTIST)
      const at2 = Artist.unsafe('other')
      expect(at1.equals(at2)).toBeFalsy()
    })
  })
})
