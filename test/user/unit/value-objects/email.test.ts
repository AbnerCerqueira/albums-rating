import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { EMAIL } from '../fixtures'

describe('Email', () => {
  describe('create', () => {
    test('creates with valid email', () => {
      const result = unwrap(Email.create(EMAIL))
      expect(result.value).toBe(EMAIL)
    })

    test('normalizes email to lowercase', () => {
      const result = unwrap(Email.create(EMAIL.toUpperCase()))
      expect(result.value).not.toBe(EMAIL.toUpperCase())
      expect(result.value).toBe(EMAIL.toLocaleLowerCase())
    })

    test('trims whitespaces', () => {
      const result = unwrap(Email.create(`  ${EMAIL}  `))
      expect(result.value).toBe(EMAIL)
    })

    test('returns error for empty email', () => {
      expect(() => unwrap(Email.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for invalid email format', () => {
      expect(() => unwrap(Email.create('not-an-email'))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for whitespace-only email', () => {
      expect(() => unwrap(Email.create('   '))).toThrow(InvalidArgumentError)
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const em1 = Email.unsafe(EMAIL)
      const em2 = Email.unsafe(EMAIL)
      expect(em1.equals(em2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const em1 = Email.unsafe(EMAIL)
      const em2 = Email.unsafe('outroemail@email.com')
      expect(em1.equals(em2)).toBeFalsy()
    })
  })
})
