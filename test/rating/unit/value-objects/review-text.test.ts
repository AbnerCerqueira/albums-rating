import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { ReviewText } from '@/contexts/rating/domain/value-objects/review-text'
import { REVIEW_TEXT } from '../fixtures'

describe('ReviewText', () => {
  describe('create', () => {
    test('creates with valid text', () => {
      const result = unwrap(ReviewText.create(REVIEW_TEXT))
      expect(result.value).toBe(REVIEW_TEXT)
    })

    test('trims whitespaces', () => {
      const result = unwrap(ReviewText.create(`  ${REVIEW_TEXT}  `))
      expect(result.value).toBe(REVIEW_TEXT)
    })

    test('returns error for empty string', () => {
      expect(() => unwrap(ReviewText.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only string', () => {
      expect(() => unwrap(ReviewText.create('   '))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for text exceeding 5000 characters', () => {
      const longText = 'a'.repeat(5001)
      expect(() => unwrap(ReviewText.create(longText))).toThrow(
        InvalidArgumentError
      )
    })

    test('creates with text at exactly 5000 characters', () => {
      const exactText = 'a'.repeat(5000)
      const result = unwrap(ReviewText.create(exactText))
      expect(result.value).toBe(exactText)
    })
  })

  describe('unsafe', () => {
    test('creates without validation', () => {
      const text = ReviewText.unsafe('')
      expect(text.value).toBe('')
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const t1 = ReviewText.unsafe(REVIEW_TEXT)
      const t2 = ReviewText.unsafe(REVIEW_TEXT)
      expect(t1.equals(t2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const t1 = ReviewText.unsafe(REVIEW_TEXT)
      const t2 = ReviewText.unsafe('Outro texto')
      expect(t1.equals(t2)).toBeFalsy()
    })
  })
})
