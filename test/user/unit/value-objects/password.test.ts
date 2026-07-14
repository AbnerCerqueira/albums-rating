import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { PASSWORD } from '../fixtures'

describe('Password', () => {
  describe('create', () => {
    test('creates with valid password', () => {
      const result = unwrap(Password.create(PASSWORD))
      expect(result.value).toBe(PASSWORD)
    })

    test('trims whitespaces', () => {
      const result = unwrap(Password.create(`  ${PASSWORD}  `))
      expect(result.value).toBe(PASSWORD)
    })

    test('returns error for empty password', () => {
      expect(() => unwrap(Password.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only password', () => {
      expect(() => unwrap(Password.create('   '))).toThrow(InvalidArgumentError)
    })

    test('returns error for password without number', () => {
      expect(() => unwrap(Password.create('Minhasenh@abc'))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for password without uppercase', () => {
      expect(() => unwrap(Password.create('minhasenh@1'))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for password without lowercase', () => {
      expect(() => unwrap(Password.create('MINHASENH@1'))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for password without special character', () => {
      expect(() => unwrap(Password.create('Minhasenh1a'))).toThrow(
        InvalidArgumentError
      )
    })

    test('returns error for password shorter than 8 characters', () => {
      expect(() => unwrap(Password.create('Ab@1bcd'))).toThrow(
        InvalidArgumentError
      )
    })

    test('accepts password with exactly 8 characters', () => {
      const result = unwrap(Password.create('Abcdef1@'))
      expect(result.value).toBe('Abcdef1@')
    })
  })

  describe('unsafe', () => {
    test('creates password without validation', () => {
      const pw = Password.unsafe('weak')
      expect(pw.value).toBe('weak')
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const pw1 = Password.unsafe(PASSWORD)
      const pw2 = Password.unsafe(PASSWORD)
      expect(pw1.equals(pw2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const pw1 = Password.unsafe(PASSWORD)
      const pw2 = Password.unsafe('Outrasenh@1')
      expect(pw1.equals(pw2)).toBeFalsy()
    })
  })
})
