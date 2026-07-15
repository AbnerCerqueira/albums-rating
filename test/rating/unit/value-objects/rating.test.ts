import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Rating } from '@/contexts/rating/domain/value-objects/rating'

describe('Rating', () => {
  describe('create', () => {
    test('creates with valid integer ratings', () => {
      for (const value of [0, 1, 2, 3, 4, 5]) {
        const result = unwrap(Rating.create(value))
        expect(result.value).toBe(value)
      }
    })

    test('creates with valid half-step ratings', () => {
      for (const value of [0.5, 1.5, 2.5, 3.5, 4.5]) {
        const result = unwrap(Rating.create(value))
        expect(result.value).toBe(value)
      }
    })

    test('returns error for negative rating', () => {
      expect(() => unwrap(Rating.create(-0.5))).toThrow(InvalidArgumentError)
      expect(() => unwrap(Rating.create(-1))).toThrow(InvalidArgumentError)
    })

    test('returns error for rating above 5', () => {
      expect(() => unwrap(Rating.create(5.5))).toThrow(InvalidArgumentError)
      expect(() => unwrap(Rating.create(6))).toThrow(InvalidArgumentError)
    })

    test('returns error for non-multiple of 0.5', () => {
      expect(() => unwrap(Rating.create(3.7))).toThrow(InvalidArgumentError)
      expect(() => unwrap(Rating.create(2.3))).toThrow(InvalidArgumentError)
      expect(() => unwrap(Rating.create(4.1))).toThrow(InvalidArgumentError)
      expect(() => unwrap(Rating.create(1.99))).toThrow(InvalidArgumentError)
    })
  })

  describe('unsafe', () => {
    test('creates without validation', () => {
      const rating = Rating.unsafe(3.7)
      expect(rating.value).toBe(3.7)
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const r1 = Rating.unsafe(4)
      const r2 = Rating.unsafe(4)
      expect(r1.equals(r2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const r1 = Rating.unsafe(4)
      const r2 = Rating.unsafe(3)
      expect(r1.equals(r2)).toBeFalsy()
    })
  })
})
