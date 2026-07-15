import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { createTestAlbumId, createTestUserId } from '../fixtures'

describe('ReviewId', () => {
  describe('create', () => {
    test('creates with userId and albumId', () => {
      const userId = createTestUserId()
      const albumId = createTestAlbumId()
      const id = ReviewId.create({ albumId, userId })

      expect(id.userId).toBe(userId)
      expect(id.albumId).toBe(albumId)
    })
  })

  describe('equals', () => {
    test('returns true when both userId and albumId match', () => {
      const userId = createTestUserId()
      const albumId = createTestAlbumId()
      const id1 = ReviewId.create({ albumId, userId })
      const id2 = ReviewId.create({ albumId, userId })

      expect(id1.equals(id2)).toBeTruthy()
    })

    test('returns true when comparing to itself', () => {
      const id = ReviewId.create({
        albumId: createTestAlbumId(),
        userId: createTestUserId(),
      })
      expect(id.equals(id)).toBeTruthy()
    })

    test('returns false when userId differs', () => {
      const albumId = createTestAlbumId()
      const id1 = ReviewId.create({
        albumId,
        userId: createTestUserId('a@a.com', 'user1'),
      })
      const id2 = ReviewId.create({
        albumId,
        userId: createTestUserId('b@b.com', 'user2'),
      })

      expect(id1.equals(id2)).toBeFalsy()
    })

    test('returns false when albumId differs', () => {
      const userId = createTestUserId()
      const id1 = ReviewId.create({
        albumId: createTestAlbumId('Album 1', 'Artist A'),
        userId,
      })
      const id2 = ReviewId.create({
        albumId: createTestAlbumId('Album 2', 'Artist B'),
        userId,
      })

      expect(id1.equals(id2)).toBeFalsy()
    })

    test('returns false when both differ', () => {
      const id1 = ReviewId.create({
        albumId: createTestAlbumId('Album 1', 'Artist A'),
        userId: createTestUserId('a@a.com', 'user1'),
      })
      const id2 = ReviewId.create({
        albumId: createTestAlbumId('Album 2', 'Artist B'),
        userId: createTestUserId('b@b.com', 'user2'),
      })

      expect(id1.equals(id2)).toBeFalsy()
    })
  })
})
