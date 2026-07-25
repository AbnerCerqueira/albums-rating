import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { GenreName } from '@/contexts/catalog/domain/value-objects/genre-name'
import { GENRE } from '../fixtures'

describe('GenreName', () => {
  describe('create', () => {
    test('creates with valid name', () => {
      const genreName = unwrap(GenreName.create(GENRE))
      expect(genreName.value).toBe(GENRE)
    })

    test('trims whitespaces', () => {
      const genreName = unwrap(GenreName.create(`  ${GENRE}  `))
      expect(genreName.value).toBe(GENRE)
    })

    test('returns error for empty name', () => {
      expect(() => unwrap(GenreName.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only name', () => {
      expect(() => unwrap(GenreName.create('   '))).toThrow(
        InvalidArgumentError
      )
    })

    test('is a value object', () => {
      const genreName = unwrap(GenreName.create(GENRE))
      expect(genreName).toBeInstanceOf(GenreName)
    })
  })
})
