import { PublicId } from '@/contexts/shared/public-id'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('PublicId', () => {
  describe('create', () => {
    test('generates UUID when no value provided', () => {
      const id = PublicId.create()
      expect(id.value).toMatch(UUID_REGEX)
    })

    test('uses provided value when given', () => {
      const id = PublicId.create('my-public-id')
      expect(id.value).toBe('my-public-id')
    })

    test('normalizes value to lowercase', () => {
      const id = PublicId.create('UPPERCASE-ID')
      expect(id.value).toBe('uppercase-id')
    })

    test('trims whitespaces', () => {
      const id = PublicId.create('  spaced-id  ')
      expect(id.value).toBe('spaced-id')
    })

    test('generates UUID for whitespace-only value', () => {
      const id = PublicId.create('   ')
      expect(id.value).toMatch(UUID_REGEX)
    })

    test('generates UUID for empty string', () => {
      const id = PublicId.create('')
      expect(id.value).toMatch(UUID_REGEX)
    })
  })

  describe('unsafe', () => {
    test('creates without normalization', () => {
      const id = PublicId.unsafe('  RAW-ID  ')
      expect(id.value).toBe('  RAW-ID  ')
    })
  })

  describe('equals', () => {
    test('returns true for same value', () => {
      const id1 = PublicId.create('same-id')
      const id2 = PublicId.create('same-id')
      expect(id1.equals(id2)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const id1 = PublicId.create('id-1')
      const id2 = PublicId.create('id-2')
      expect(id1.equals(id2)).toBeFalsy()
    })
  })
})
