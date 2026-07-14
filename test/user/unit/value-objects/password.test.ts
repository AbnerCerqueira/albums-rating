import { extract, unwrap } from '@/contexts/!common/result'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { PASSWORD } from '../fixtures'

describe('Password', () => {
  describe('create', () => {
    test('creates with valid password', () => {
      const [pw, err] = unwrap(Password.create(PASSWORD))
      expect(err).toBe(null)
      expect(pw?.value).toBe(PASSWORD)
    })

    test('trims whitespaces', () => {
      const [pw, err] = unwrap(Password.create(`  ${PASSWORD}  `))
      expect(err).toBe(null)
      expect(pw?.value).toBe(PASSWORD)
    })

    test('returns error for empty password', () => {
      const [pw, err] = unwrap(Password.create(''))
      expect(pw).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })

    test('returns error for whitespace-only password', () => {
      const [pw, err] = unwrap(Password.create('   '))
      expect(pw).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })

    test('returns error for password without number', () => {
      const [pw, err] = unwrap(Password.create('Minhasenh@abc'))
      expect(pw).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('returns error for password without uppercase', () => {
      const [pw, err] = unwrap(Password.create('minhasenh@1'))
      expect(pw).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('returns error for password without lowercase', () => {
      const [pw, err] = unwrap(Password.create('MINHASENH@1'))
      expect(pw).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('returns error for password without special character', () => {
      const [pw, err] = unwrap(Password.create('Minhasenh1a'))
      expect(pw).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('returns error for password shorter than 8 characters', () => {
      const [pw, err] = unwrap(Password.create('Ab@1bcd'))
      expect(pw).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('accepts password with exactly 8 characters', () => {
      const [pw, err] = unwrap(Password.create('Abcdef1@'))
      expect(err).toBe(null)
      expect(pw?.value).toBe('Abcdef1@')
    })
  })

  describe('unsafeCreate', () => {
    test('creates password without validation', () => {
      const pw = Password.unsafeCreate('weak')
      expect(pw.value).toBe('weak')
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const pw1 = extract(Password.create(PASSWORD))
      const pw2 = extract(Password.create(PASSWORD))
      expect(pw1?.equals(pw2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const pw1 = extract(Password.create(PASSWORD))
      const pw2 = extract(Password.create('Outrasenh@1'))
      expect(pw1?.equals(pw2)).toBeFalsy()
    })
  })
})
