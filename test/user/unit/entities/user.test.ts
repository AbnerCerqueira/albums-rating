import { PublicId } from '@/contexts/!common/public-id'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'
import { EMAIL, PASSWORD, USERNAME } from '../fixtures'
import { createUser } from '../helpers'

describe('User', () => {
  describe('create', () => {
    test('creates with all props', () => {
      const user = createUser()
      expect(user).toBeInstanceOf(User)
    })

    test('sets createdAt and updatedAt close together on creation', () => {
      const user = createUser()
      const diff = Math.abs(
        user.getCreationDate().getTime() - user.getUpdateDate().getTime()
      )
      expect(diff).toBeLessThan(100)
    })

    test('assigns a PublicId instance', () => {
      const user = createUser()
      expect(user.publicId).toBeInstanceOf(PublicId)
    })

    test('creates with UserId and Password instances', () => {
      const user = createUser()
      expect(user.id).toBeInstanceOf(UserId)
      expect(user.password).toBeInstanceOf(Password)
    })
  })

  describe('fromPersistence', () => {
    test('rebuilds from persistence props', () => {
      const user = createUser()
      const restored = User.fromPersistence({
        createdAt: user.getCreationDate(),
        id: user.id,
        password: user.password,
        publicId: user.publicId,
        updatedAt: user.getUpdateDate(),
      })

      expect(restored.id.equals(user.id)).toBeTruthy()
      expect(restored.publicId.value).toBe(user.publicId.value)
      expect(restored.password.value).toBe(user.password.value)
      expect(restored.getCreationDate().getTime()).toBe(
        user.getCreationDate().getTime()
      )
      expect(restored.getUpdateDate().getTime()).toBe(
        user.getUpdateDate().getTime()
      )
    })

    test('rebuilds with different timestamps', () => {
      const id = UserId.create({
        email: Email.unsafe(EMAIL),
        username: Username.unsafe(USERNAME),
      })
      const password = Password.unsafe(PASSWORD)
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-06-15')

      const restored = User.fromPersistence({
        createdAt,
        id,
        password,
        publicId: PublicId.unsafe('fixed-public-id'),
        updatedAt,
      })

      expect(restored.getCreationDate().getTime()).toBe(createdAt.getTime())
      expect(restored.getUpdateDate().getTime()).toBe(updatedAt.getTime())
      expect(restored.getCreationDate().getTime()).not.toBe(
        restored.getUpdateDate().getTime()
      )
      expect(restored.publicId.value).toBe('fixed-public-id')
    })

    test('rebuilds with given publicId', () => {
      const id = UserId.create({
        email: Email.unsafe(EMAIL),
        username: Username.unsafe(USERNAME),
      })
      const password = Password.unsafe(PASSWORD)
      const now = new Date()

      const restored = User.fromPersistence({
        createdAt: now,
        id,
        password,
        publicId: PublicId.unsafe('fixed-public-id'),
        updatedAt: now,
      })

      expect(restored.publicId.value).toBe('fixed-public-id')
    })
  })

  describe('getters', () => {
    test('id returns email and username', () => {
      const user = createUser()
      expect(user.id.username.value).toBe(USERNAME)
      expect(user.id.email.value).toBe(EMAIL)
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
      const date = user.getCreationDate()
      date.setFullYear(2000)
      expect(user.getCreationDate().getTime()).not.toBe(date.getTime())
    })
  })

  describe('equals', () => {
    test('returns true for same id', () => {
      const email = Email.unsafe(EMAIL)
      const username = Username.unsafe(USERNAME)
      const id = UserId.create({ email, username })
      const password = Password.unsafe(PASSWORD)
      const user1 = User.create({ id, password })
      const user2 = User.create({ id, password })

      expect(user1.equals(user2)).toBeTruthy()
    })

    test('returns true when comparing to itself', () => {
      const user = createUser()
      expect(user.equals(user)).toBeTruthy()
    })

    test('returns false for different ids', () => {
      const user1 = createUser({
        id: UserId.create({
          email: Email.unsafe('emaildiferente@fasd.com'),
          username: Username.unsafe(USERNAME),
        }),
      })
      const user2 = createUser()

      expect(user1.equals(user2)).toBeFalsy()
    })

    test('returns true when id matches but password differs', () => {
      const id = UserId.create({
        email: Email.unsafe('emaildiferente@fasd.com'),
        username: Username.unsafe(USERNAME),
      })
      const user1 = createUser({ id })
      const user2 = createUser({
        id,
        password: Password.unsafe('Outrasenh@1'),
      })

      expect(user1.equals(user2)).toBeTruthy()
    })
  })
})
