import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { ReviewedAt } from '@/contexts/rating/domain/value-objects/reviewed-at'
import { REVIEWED_AT } from '../fixtures'

describe('ReviewedAt', () => {
  describe('create', () => {
    test('creates with valid past date', () => {
      const result = unwrap(ReviewedAt.create(REVIEWED_AT))
      expect(result.value.getTime()).toBe(REVIEWED_AT.getTime())
    })

    test('creates with current date', () => {
      const now = new Date()
      const result = unwrap(ReviewedAt.create(now))
      expect(result.value.getTime()).toBe(now.getTime())
    })

    test('returns error for invalid date', () => {
      expect(() => unwrap(ReviewedAt.create(new Date('invalid')))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for future date', () => {
      const future = new Date(Date.now() + 100_000)
      expect(() => unwrap(ReviewedAt.create(future))).toThrow(
        InvalidArgumentError
      )
    })
  })

  describe('unsafe', () => {
    test('creates with a copy of the date', () => {
      const date = new Date('2025-01-01')
      const reviewedAt = ReviewedAt.unsafe(date)
      date.setFullYear(2000)
      expect(reviewedAt.value.getFullYear()).not.toBe(2000)
    })
  })

  describe('equals', () => {
    test('returns true for same timestamp', () => {
      const date = new Date('2025-06-15')
      const r1 = ReviewedAt.unsafe(date)
      const r2 = ReviewedAt.unsafe(new Date(date.getTime()))
      expect(r1.equals(r2)).toBeTruthy()
    })

    test('returns false for different timestamps', () => {
      const r1 = ReviewedAt.unsafe(new Date('2025-01-01'))
      const r2 = ReviewedAt.unsafe(new Date('2025-06-15'))
      expect(r1.equals(r2)).toBeFalsy()
    })
  })
})
