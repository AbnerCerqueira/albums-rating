import { describe, expect, test, vi } from 'vitest'
import { PublicId } from '@/contexts/!common/public-id'
import { MongooseAlbumReviewCountGateway } from '@/contexts/stats/infra/gateways/album-review-count-gateway'

describe('MongooseAlbumReviewCountGateway', () => {
  test('maps review counts by publicId', async () => {
    const albumChartsRepository = {
      findMostReviewed: vi.fn(),
      findReviewCountsByPublicIds: vi.fn().mockResolvedValue([
        { averageRating: 3, publicId: 'album-a', reviewCount: 3 },
        { averageRating: 4, publicId: 'album-b', reviewCount: 7 },
      ]),
      findTopRated: vi.fn(),
      refreshAll: vi.fn(),
    }

    const gateway = new MongooseAlbumReviewCountGateway(albumChartsRepository)

    const result = await gateway.findCountsByPublicIds([
      PublicId.unsafe('album-a'),
      PublicId.unsafe('album-b'),
    ])

    expect(result).toEqual({
      'album-a': { averageRating: 3, reviewCount: 3 },
      'album-b': { averageRating: 4, reviewCount: 7 },
    })
  })

  test('returns empty object when no publicIds are provided', async () => {
    const albumChartsRepository = {
      findMostReviewed: vi.fn(),
      findReviewCountsByPublicIds: vi.fn().mockResolvedValue([]),
      findTopRated: vi.fn(),
      refreshAll: vi.fn(),
    }

    const gateway = new MongooseAlbumReviewCountGateway(albumChartsRepository)

    const result = await gateway.findCountsByPublicIds([])

    expect(result).toEqual({})
  })
})
