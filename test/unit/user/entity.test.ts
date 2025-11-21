import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { Username } from '@/contexts/user/domain/value-objects/username'

describe('User Entity', () => {
  describe('Email', () => {
    it('should create a Email', () => {
      const validEmail = 'email@email.com'
      expect(Email.create(validEmail).isOk).toBeTruthy()
    })
    it('should return error for invalid email', () => {
      const invalidEmail = 'invalid-email'
      expect(Email.create(invalidEmail).isOk).toBeFalsy()
    })
  })

  describe('Username', () => {
    it('should return error for username shorter than 3 characters', () => {
      const shortUsername = 'ab'
      expect(Username.create(shortUsername).isOk).toBeFalsy()
    })
    it('should return error for username longer than 100 characters', () => {
      const longUsername = 'a'.repeat(101)
      expect(Username.create(longUsername).isOk).toBeFalsy()
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
