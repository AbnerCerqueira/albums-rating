import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'

describe('User Entity', () => {
  describe('UserId', () => {
    it('should create a UserId with valid username', () => {
      const validUsername = 'validUser'
      expect(UserId.create(validUsername).isOk).toBeTruthy()
    })

    it('should return error for username shorter than 3 characters', () => {
      const shortUsername = 'ab'
      expect(UserId.create(shortUsername).isOk).toBeFalsy()
    })

    it('should return error for username longer than 100 characters', () => {
      const longUsername = 'a'.repeat(101)
      expect(UserId.create(longUsername).isOk).toBeFalsy()
    })
  })

  describe('Password', () => {
    it('should create a valid password', () => {
      const validPassword = 'a'.repeat(8)
      expect(Password.create(validPassword).isOk).toBeTruthy()
    })

    it('should return an error for password shorter than 6 characters', () => {
      const shortPassword = 'asdf'
      expect(Password.create(shortPassword).isOk).toBeFalsy()
    })

    it('should return an error for password longer than 100 characters', () => {
      const longPassword = 'a'.repeat(101)
      expect(Password.create(longPassword).isOk).toBeFalsy()
    })
  })
})
