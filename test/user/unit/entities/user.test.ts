import { extract } from '@/contexts/!common/result'
import { User } from '@/contexts/user/domain/user'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { EMAIL, PASSWORD, USERNAME } from '../fixtures'
import { createUser } from '../helpers'

describe('User', () => {
  describe('create', () => {
    test('creates with all props', () => {
      const user = createUser()
      expect(user).toBeDefined()
    })

    test('assign publicId', () => {
      const user = createUser()
      expect(user.publicId.value).toBeDefined()
    })

    test('sets createdAt and updatedAt', () => {
      const user = createUser()
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    test('sets createdAt equal to updatedAt on creation', () => {
      const user = createUser()
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime())
    })
  })

  describe('fromPersistence', () => {
    test('rebuilds from persistence props', () => {
      const user = createUser()
      const restored = User.fromPersistence({
        createdAt: user.createdAt,
        id: user.id,
        password: user.password,
        publicId: user.publicId.value,
        updatedAt: user.updatedAt,
      })

      expect(restored.id.equals(user.id)).toBeTruthy()
      expect(restored.publicId.value).toBe(user.publicId.value)
      expect(restored.password.value).toBe(user.password.value)
      expect(restored.createdAt.getTime()).toBe(user.createdAt.getTime())
      expect(restored.updatedAt.getTime()).toBe(user.updatedAt.getTime())
    })
  })

  describe('getters', () => {
    test('id returns email and username', () => {
      const user = createUser()
      expect(user.id.username).toBe(USERNAME)
      expect(user.id.email).toBe(EMAIL)
    })

    test('password returns Password', () => {
      const user = createUser()
      expect(user.password.value).toBe(PASSWORD)
    })

    test('publicId is unique per user', () => {
      const user1 = createUser()
      const user2 = createUser()
      expect(user1.publicId.value).not.toBe(user2.publicId.value)
    })

    test('createdAt returns a copy', () => {
      const user = createUser()
      const date = user.createdAt
      date.setFullYear(2000)
      expect(user.createdAt.getTime()).not.toBe(date.getTime())
    })

    test('updatedAt returns a copy', () => {
      const user = createUser()
      const date = user.updatedAt
      date.setFullYear(2000)
      expect(user.updatedAt.getTime()).not.toBe(date.getTime())
    })
  })

  describe('equals', () => {
    test('returns true for same id', () => {
      const user1 = createUser()
      const user2 = createUser()

      expect(user1.equals(user2)).toBeTruthy()
    })

    test('returns false for different ids', () => {
      const user1 = createUser({
        id: extract(
          UserId.create({
            email: 'emaildiferente@fasd.com',
            username: USERNAME,
          })
        ),
      })
      const user2 = createUser()

      expect(user1.equals(user2)).toBeFalsy()
    })

    test('returns true when id matches but password differs', () => {
      const id = extract(UserId.create({ email: EMAIL, username: USERNAME }))
      const user1 = createUser({ id })
      const user2 = createUser({
        id,
        password: extract(Password.create('Outrasenh@1')),
      })

      expect(user1.equals(user2)).toBeTruthy()
    })
  })
})
