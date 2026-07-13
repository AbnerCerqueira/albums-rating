import { Email } from '@/contexts/user/domain/value-objects/email'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import { EMAIL, USERNAME } from '../fixtures'

describe('UserId', () => {
  describe('create', () => {
    test('creates with valid username and email', () => {
      const email = Email.unsafe(EMAIL)
      const username = Username.unsafe(USERNAME)
      const id = UserId.create({ email, username })
      expect(id.email.value).toBe(EMAIL)
      expect(id.username.value).toBe(USERNAME)
    })
  })

  describe('equals', () => {
    test('returns true for same email and username', () => {
      const email = Email.unsafe(EMAIL)
      const username = Username.unsafe(USERNAME)
      const id1 = UserId.create({ email, username })
      const id2 = UserId.create({ email, username })
      expect(id1.equals(id2)).toBeTruthy()
    })

    test('returns false for different email', () => {
      const email1 = Email.unsafe(EMAIL)
      const email2 = Email.unsafe('other@example.com')
      const username = Username.unsafe(USERNAME)
      const id1 = UserId.create({ email: email1, username })
      const id2 = UserId.create({ email: email2, username })
      expect(id1.equals(id2)).toBeFalsy()
    })

    test('returns false for different username', () => {
      const email = Email.unsafe(EMAIL)
      const username1 = Username.unsafe(USERNAME)
      const username2 = Username.unsafe('other')
      const id1 = UserId.create({ email, username: username1 })
      const id2 = UserId.create({ email, username: username2 })
      expect(id1.equals(id2)).toBeFalsy()
    })
  })
})
