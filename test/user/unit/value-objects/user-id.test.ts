import { extract, unwrap } from '@/contexts/!common/result'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { EMAIL, USERNAME } from '../fixtures'

describe('UserId', () => {
  describe('create', () => {
    test('creates with valid username and email', () => {
      const [id, err] = unwrap(
        UserId.create({ email: EMAIL, username: USERNAME })
      )
      expect(err).toBe(null)
      expect(id?.email).toBe(EMAIL)
      expect(id?.username).toBe(USERNAME)
    })

    test('normalizes email to lowercase', () => {
      const [id, err] = unwrap(
        UserId.create({ email: EMAIL.toUpperCase(), username: USERNAME })
      )
      expect(err).toBe(null)
      expect(id?.email).not.toBe(EMAIL.toUpperCase())
      expect(id?.email).toBe(EMAIL.toLocaleLowerCase())
    })

    test('trims whitespaces', () => {
      const [id, err] = unwrap(
        UserId.create({ email: `  ${EMAIL}  `, username: `  ${USERNAME}  ` })
      )
      expect(err).toBe(null)
      expect(id?.email).toBe(EMAIL)
      expect(id?.username).toBe(USERNAME)
    })

    test('returns error for empty email', () => {
      const [id, err] = unwrap(UserId.create({ email: '', username: USERNAME }))
      expect(id).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })

    test('returns error for empty username', () => {
      const [id, err] = unwrap(UserId.create({ email: EMAIL, username: '' }))
      expect(id).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })

    test('returns error for invalid email format', () => {
      const [id, err] = unwrap(
        UserId.create({ email: 'not-an-email', username: USERNAME })
      )
      expect(id).toBe(null)
      expect(err?.name).toBe('InvalidFormatError')
    })

    test('returns error for whitespace-only email', () => {
      const [id, err] = unwrap(
        UserId.create({ email: '   ', username: USERNAME })
      )
      expect(id).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })

    test('returns error for whitespace-only username', () => {
      const [id, err] = unwrap(UserId.create({ email: EMAIL, username: '   ' }))
      expect(id).toBe(null)
      expect(err?.name).toBe('EmptyValueError')
    })
  })

  describe('unsafeCreate', () => {
    test('creates UserId without validation', () => {
      const id = UserId.unsafeCreate({ email: 'test', username: 'test' })
      expect(id.email).toBe('test')
      expect(id.username).toBe('test')
    })
  })

  describe('equals', () => {
    test('returns true for same email and username', () => {
      const id1 = extract(UserId.create({ email: EMAIL, username: USERNAME }))
      const id2 = extract(UserId.create({ email: EMAIL, username: USERNAME }))
      expect(id1?.equals(id2)).toBeTruthy()
    })

    test('returns false for different email', () => {
      const id1 = extract(UserId.create({ email: EMAIL, username: USERNAME }))
      const id2 = extract(
        UserId.create({ email: 'other@example.com', username: USERNAME })
      )
      expect(id1?.equals(id2)).toBeFalsy()
    })

    test('returns false for different username', () => {
      const id1 = extract(UserId.create({ email: EMAIL, username: USERNAME }))
      const id2 = extract(UserId.create({ email: EMAIL, username: 'other' }))
      expect(id1?.equals(id2)).toBeFalsy()
    })
  })
})
