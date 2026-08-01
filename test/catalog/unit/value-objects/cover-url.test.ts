import { CoverUrl } from '@/contexts/catalog/domain/value-objects/cover-url'
import { env } from '@/infra/config/envs'

const { DEFAULT_COVER_URL } = env

describe('CoverUrl', () => {
  describe('create', () => {
    test('accepts a valid root-relative path', () => {
      const coverUrl = CoverUrl.create('/covers/album-123.jpg')
      expect(coverUrl.value).toBe('/covers/album-123.jpg')
    })

    test('accepts a valid absolute URL', () => {
      const coverUrl = CoverUrl.create('https://cdn.example.com/cover.jpg')
      expect(coverUrl.value).toBe('https://cdn.example.com/cover.jpg')
    })

    test('trims the value', () => {
      const coverUrl = CoverUrl.create('  /covers/album-123.jpg  ')
      expect(coverUrl.value).toBe('/covers/album-123.jpg')
    })

    test('falls back to the default when not provided', () => {
      const coverUrl = CoverUrl.create()
      expect(coverUrl.value).toBe(DEFAULT_COVER_URL)
    })

    test('falls back when the string is empty', () => {
      const coverUrl = CoverUrl.create('   ')
      expect(coverUrl.value).toBe(DEFAULT_COVER_URL)
    })

    test('falls back when the string contains whitespace', () => {
      const coverUrl = CoverUrl.create('/covers/my cover.jpg')
      expect(coverUrl.value).toBe(DEFAULT_COVER_URL)
    })

    test('falls back when the string is not a path or URL', () => {
      const coverUrl = CoverUrl.create('not-a-path')
      expect(coverUrl.value).toBe(DEFAULT_COVER_URL)
    })

    test('falls back when the string is too long', () => {
      const coverUrl = CoverUrl.create(`/covers/${'a'.repeat(2048)}.jpg`)
      expect(coverUrl.value).toBe(DEFAULT_COVER_URL)
    })
  })

  describe('unsafe', () => {
    test('wraps the value as is', () => {
      const coverUrl = CoverUrl.unsafe('/covers/from-persistence.jpg')
      expect(coverUrl.value).toBe('/covers/from-persistence.jpg')
    })
  })

  describe('isDefault', () => {
    test('returns true for the default cover url', () => {
      const coverUrl = CoverUrl.create()
      expect(coverUrl.isDefault()).toBeTruthy()
    })

    test('returns false for a custom cover url', () => {
      const coverUrl = CoverUrl.create('/covers/album-123.jpg')
      expect(coverUrl.isDefault()).toBeFalsy()
    })
  })

  describe('equals', () => {
    test('returns true for the same value', () => {
      const a = CoverUrl.create('/covers/a.jpg')
      const b = CoverUrl.create('/covers/a.jpg')
      expect(a.equals(b)).toBeTruthy()
    })

    test('returns false for different values', () => {
      const a = CoverUrl.create('/covers/a.jpg')
      const b = CoverUrl.create('/covers/b.jpg')
      expect(a.equals(b)).toBeFalsy()
    })
  })
})
