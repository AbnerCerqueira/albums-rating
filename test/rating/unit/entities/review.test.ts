import { PublicId } from '@/contexts/!common/public-id'
import { Review } from '@/contexts/rating/domain/review'
import { Rating } from '@/contexts/rating/domain/value-objects/rating'
import { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import { ReviewText } from '@/contexts/rating/domain/value-objects/review-text'
import { ReviewedAt } from '@/contexts/rating/domain/value-objects/reviewed-at'
import {
  createTestAlbumId,
  createTestUserId,
  RATING,
  REVIEW_TEXT,
  REVIEWED_AT,
} from '../fixtures'
import { createReview } from '../helpers'

describe('Review', () => {
  describe('create', () => {
    test('creates with all props', () => {
      const review = createReview()
      expect(review).toBeInstanceOf(Review)
    })

    test('forces isEdited to false', () => {
      const review = createReview()
      expect(review.isEdited).toBeFalsy()
    })

    test('assigns a PublicId instance', () => {
      const review = createReview()
      expect(review.publicId).toBeInstanceOf(PublicId)
    })

    test('sets createdAt and updatedAt close together on creation', () => {
      const review = createReview()
      const diff = Math.abs(
        review.getCreationDate().getTime() - review.getUpdateDate().getTime()
      )
      expect(diff).toBeLessThan(100)
    })

    test('creates with reviewText', () => {
      const review = createReview()
      expect(review.reviewText).toBeInstanceOf(ReviewText)
      expect(review.reviewText?.value).toBe(REVIEW_TEXT)
    })

    test('creates without reviewText', () => {
      const review = createReview({ reviewText: undefined })
      expect(review.reviewText).toBeNull()
    })

    test('creates with isFavorite true', () => {
      const review = createReview({ isFavorite: true })
      expect(review.isFavorite).toBeTruthy()
    })
  })

  describe('edit', () => {
    test('returns a new instance with isEdited true', () => {
      const review = createReview()
      const newText = ReviewText.unsafe('Texto editado')
      const edited = review.edit(newText)

      expect(edited.isEdited).toBeTruthy()
      expect(edited.reviewText?.value).toBe('Texto editado')
    })

    test('preserves the original review unchanged', () => {
      const review = createReview()
      const newText = ReviewText.unsafe('Texto editado')
      review.edit(newText)

      expect(review.isEdited).toBeFalsy()
      expect(review.reviewText?.value).toBe(REVIEW_TEXT)
    })

    test('preserves id, isFavorite, rating, reviewedAt and publicId', () => {
      const review = createReview()
      const newText = ReviewText.unsafe('Texto editado')
      const edited = review.edit(newText)

      expect(edited.id.equals(review.id)).toBeTruthy()
      expect(edited.isFavorite).toBe(review.isFavorite)
      expect(edited.rating.equals(review.rating)).toBeTruthy()
      expect(edited.reviewedAt.equals(review.reviewedAt)).toBeTruthy()
      expect(edited.publicId.value).toBe(review.publicId.value)
    })

    test('updates the updatedAt timestamp', () => {
      const review = createReview()
      const newText = ReviewText.unsafe('Texto editado')
      const edited = review.edit(newText)

      expect(edited.getUpdateDate().getTime()).toBeGreaterThanOrEqual(
        review.getUpdateDate().getTime()
      )
    })
  })

  describe('clearText', () => {
    test('removes reviewText and sets isEdited to true', () => {
      const review = createReview()
      const cleared = review.clearText()

      expect(cleared.reviewText).toBeNull()
      expect(cleared.isEdited).toBeTruthy()
    })

    test('preserves the original review unchanged', () => {
      const review = createReview()
      review.clearText()

      expect(review.reviewText?.value).toBe(REVIEW_TEXT)
      expect(review.isEdited).toBeFalsy()
    })

    test('preserves id, isFavorite, rating, reviewedAt and publicId', () => {
      const review = createReview()
      const cleared = review.clearText()

      expect(cleared.id.equals(review.id)).toBeTruthy()
      expect(cleared.isFavorite).toBe(review.isFavorite)
      expect(cleared.rating.equals(review.rating)).toBeTruthy()
      expect(cleared.reviewedAt.equals(review.reviewedAt)).toBeTruthy()
      expect(cleared.publicId.value).toBe(review.publicId.value)
    })

    test('updates the updatedAt timestamp', () => {
      const review = createReview()
      const cleared = review.clearText()

      expect(cleared.getUpdateDate().getTime()).toBeGreaterThanOrEqual(
        review.getUpdateDate().getTime()
      )
    })
  })

  describe('fromPersistence', () => {
    test('rebuilds from persistence props', () => {
      const review = createReview()
      const restored = Review.fromPersistence({
        createdAt: review.getCreationDate(),
        id: review.id,
        isEdited: review.isEdited,
        isFavorite: review.isFavorite,
        publicId: review.publicId,
        rating: review.rating,
        reviewedAt: review.reviewedAt,
        reviewText: review.reviewText,
        updatedAt: review.getUpdateDate(),
      })

      expect(restored.id.equals(review.id)).toBeTruthy()
      expect(restored.publicId.value).toBe(review.publicId.value)
      expect(restored.isEdited).toBe(review.isEdited)
      expect(restored.isFavorite).toBe(review.isFavorite)
      expect(restored.rating.value).toBe(review.rating.value)
      expect(restored.reviewText?.value).toBe(review.reviewText?.value)
      expect(restored.reviewedAt.value.getTime()).toBe(
        review.reviewedAt.value.getTime()
      )
      expect(restored.getCreationDate().getTime()).toBe(
        review.getCreationDate().getTime()
      )
      expect(restored.getUpdateDate().getTime()).toBe(
        review.getUpdateDate().getTime()
      )
    })

    test('rebuilds with different timestamps', () => {
      const id = ReviewId.create({
        albumId: createTestAlbumId(),
        userId: createTestUserId(),
      })
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-06-15')

      const restored = Review.fromPersistence({
        createdAt,
        id,
        isEdited: true,
        isFavorite: true,
        publicId: PublicId.unsafe('fixed-public-id'),
        rating: Rating.unsafe(RATING),
        reviewedAt: ReviewedAt.unsafe(REVIEWED_AT),
        reviewText: ReviewText.unsafe(REVIEW_TEXT),
        updatedAt,
      })

      expect(restored.getCreationDate().getTime()).toBe(createdAt.getTime())
      expect(restored.getUpdateDate().getTime()).toBe(updatedAt.getTime())
      expect(restored.getCreationDate().getTime()).not.toBe(
        restored.getUpdateDate().getTime()
      )
      expect(restored.publicId.value).toBe('fixed-public-id')
      expect(restored.isEdited).toBeTruthy()
      expect(restored.isFavorite).toBeTruthy()
    })
  })

  describe('getters', () => {
    test('getCreationDate returns a copy', () => {
      const review = createReview()
      const date = review.getCreationDate()
      date.setFullYear(2000)
      expect(review.getCreationDate().getTime()).not.toBe(date.getTime())
    })

    test('getUpdateDate returns a copy', () => {
      const review = createReview()
      const date = review.getUpdateDate()
      date.setFullYear(2000)
      expect(review.getUpdateDate().getTime()).not.toBe(date.getTime())
    })

    test('publicId is unique per review', () => {
      const r1 = createReview()
      const r2 = createReview()
      expect(r1.publicId.value).not.toBe(r2.publicId.value)
    })
  })

  describe('equals', () => {
    test('returns true for same id', () => {
      const id = ReviewId.create({
        albumId: createTestAlbumId(),
        userId: createTestUserId(),
      })

      const r1 = Review.create({
        id,
        isFavorite: false,
        rating: Rating.unsafe(RATING),
        reviewedAt: ReviewedAt.unsafe(REVIEWED_AT),
        reviewText: ReviewText.unsafe(REVIEW_TEXT),
      })
      const r2 = Review.create({
        id,
        isFavorite: true,
        rating: Rating.unsafe(1),
        reviewedAt: ReviewedAt.unsafe(REVIEWED_AT),
        reviewText: null,
      })

      expect(r1.equals(r2)).toBeTruthy()
    })

    test('returns true when comparing to itself', () => {
      const review = createReview()
      expect(review.equals(review)).toBeTruthy()
    })

    test('returns false for different ids', () => {
      const r1 = createReview({
        id: ReviewId.create({
          albumId: createTestAlbumId('Album 1', 'Artist 1'),
          userId: createTestUserId('a@a.com', 'user1'),
        }),
      })
      const r2 = createReview()

      expect(r1.equals(r2)).toBeFalsy()
    })

    test('returns true when id matches but other props differ', () => {
      const id = ReviewId.create({
        albumId: createTestAlbumId(),
        userId: createTestUserId(),
      })

      const r1 = Review.create({
        id,
        isFavorite: false,
        rating: Rating.unsafe(1),
        reviewedAt: ReviewedAt.unsafe(REVIEWED_AT),
        reviewText: null,
      })
      const r2 = Review.create({
        id,
        isFavorite: true,
        rating: Rating.unsafe(5),
        reviewedAt: ReviewedAt.unsafe(REVIEWED_AT),
        reviewText: null,
      })

      expect(r1.equals(r2)).toBeTruthy()
    })
  })
})
