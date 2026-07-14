import { InvalidArgumentError } from '@/contexts/!common/errors'
import { unwrap } from '@/contexts/!common/result'
import { Username } from '@/contexts/user/domain/value-objects/username'
import { USERNAME } from '../fixtures'

describe('Username', () => {
  describe('create', () => {
    test('creates with valid username', () => {
      const result = unwrap(Username.create(USERNAME))
      expect(result.value).toBe(USERNAME)
    })

    test('trims whitespaces', () => {
      const result = unwrap(Username.create(`  ${USERNAME}  `))
      expect(result.value).toBe(USERNAME)
    })

    test('returns error for empty username', () => {
      expect(() => unwrap(Username.create(''))).toThrow(InvalidArgumentError)
    })

    test('returns error for whitespace-only username', () => {
      expect(() => unwrap(Username.create('   '))).toThrow(InvalidArgumentError)
    })

    test('does not normalize case', () => {
      const result = unwrap(Username.create(USERNAME.toUpperCase()))
      expect(result.value).toBe(USERNAME.toUpperCase())
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const un1 = Username.unsafe(USERNAME)
      const un2 = Username.unsafe(USERNAME)
      expect(un1.equals(un2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const un1 = Username.unsafe(USERNAME)
      const un2 = Username.unsafe('other')
      expect(un1.equals(un2)).toBeFalsy()
    })
  })
})
