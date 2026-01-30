import assert from 'node:assert/strict'
import { DomainError } from '@/contexts/!common/domain-error'
import { Title } from '@/contexts/catalog/domain/value-objects/title'

describe('Album entity', () => {
  describe('Title', () => {
    it('should create title', () => {
      const result = Title.create('a')

      expect(result.isOk).toBeTruthy()
    })

    it('should return err if invalid title', () => {
      const result = Title.create('a'.repeat(300))
      expect(result.isOk).toBeFalsy()
      assert(!result.isOk)
      expect(result.error).instanceOf(DomainError.InvalidArgument)
    })
  })
})
