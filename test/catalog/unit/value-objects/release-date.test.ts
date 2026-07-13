import { unwrap } from '@/contexts/!common/result'
import { ReleaseDate } from '@/contexts/catalog/domain/value-objects/release-date'
import { RELEASE_DATE } from '../fixtures'

describe('ReleaseDate', () => {
  describe('create', () => {
    test('creates with valid date', () => {
      const result = unwrap(ReleaseDate.create(RELEASE_DATE))
      expect(result.value.getTime()).toBe(RELEASE_DATE.getTime())
    })

    test('creates with different dates', () => {
      const dates = [
        new Date('2020-01-01'),
        new Date('2024-12-31'),
        new Date('1999-06-15'),
      ]
      for (const date of dates) {
        const result = unwrap(ReleaseDate.create(date))
        expect(result.value.getTime()).toBe(date.getTime())
      }
    })
  })

  describe('unsafe', () => {
    test('creates without validation', () => {
      const date = new Date('2024-06-15')
      const rd = ReleaseDate.unsafe(date)
      expect(rd.value.getTime()).toBe(date.getTime())
    })

    test('returns a new Date instance', () => {
      const date = new Date('2024-06-15')
      const rd = ReleaseDate.unsafe(date)
      expect(rd.value).not.toBe(date)
    })
  })

  describe('equals', () => {
    test('returns true for same date', () => {
      const date = new Date('2024-06-15')
      const rd1 = ReleaseDate.unsafe(date)
      const rd2 = ReleaseDate.unsafe(new Date(date.getTime()))
      expect(rd1.equals(rd2)).toBeTruthy()
    })

    test('returns false for different dates', () => {
      const rd1 = ReleaseDate.unsafe(new Date('2024-06-15'))
      const rd2 = ReleaseDate.unsafe(new Date('2024-12-25'))
      expect(rd1.equals(rd2)).toBeFalsy()
    })
  })
})
