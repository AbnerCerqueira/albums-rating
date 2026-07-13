import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { TITLE } from '../fixtures'

describe('Title', () => {
  describe('create', () => {
    test('creates with valid title', () => {
      const result = unwrap(Title.create(TITLE))
      expect(result.value).toBe(TITLE)
    })

    test('trims whitespaces', () => {
      const result = unwrap(Title.create(`  ${TITLE}  `))
      expect(result.value).toBe(TITLE)
    })

    test('returns error for empty title', () => {
      expect(() => unwrap(Title.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only title', () => {
      expect(() => unwrap(Title.create('   '))).toThrow(InvalidArgumentError)
    })

    test('does not normalize case', () => {
      const result = unwrap(Title.create(TITLE.toUpperCase()))
      expect(result.value).toBe(TITLE.toUpperCase())
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const tt1 = Title.unsafe(TITLE)
      const tt2 = Title.unsafe(TITLE)
      expect(tt1.equals(tt2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const tt1 = Title.unsafe(TITLE)
      const tt2 = Title.unsafe('other')
      expect(tt1.equals(tt2)).toBeFalsy()
    })
  })
})
