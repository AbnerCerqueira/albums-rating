import { describe, expect, test, vi } from 'vitest'
import { AlbumReviewCounts } from '@/contexts/shared/album-review-counts'
import { PublicId } from '@/contexts/shared/public-id'
import { MongooseAlbumReviewCountGateway } from '@/contexts/stats/infra/gateways/album-review-count-gateway'

describe('MongooseAlbumReviewCountGateway', () => {
  test('maps review counts by publicId', async () => {
    const albumChartsRepository = {
      findMostReviewed: vi.fn(),
      findReviewCountsByPublicIds: vi.fn().mockResolvedValue(
        AlbumReviewCounts.fromRecord({
          'album-a': { averageRating: 3, reviewCount: 3 },
          'album-b': { averageRating: 4, reviewCount: 7 },
        })
      ),
      findTopRated: vi.fn(),
      refreshAll: vi.fn(),
    }

    const gateway = new MongooseAlbumReviewCountGateway(albumChartsRepository)

    const result = await gateway.findCountsByPublicIds([
      PublicId.unsafe('album-a'),
      PublicId.unsafe('album-b'),
    ])

    expect(result.forPublicId(PublicId.unsafe('album-a'))).toEqual({
      averageRating: 3,
      reviewCount: 3,
    })
    expect(result.forPublicId(PublicId.unsafe('album-b'))).toEqual({
      averageRating: 4,
      reviewCount: 7,
    })
  })

  test('returns empty counts when no publicIds are provided', async () => {
    const albumChartsRepository = {
      findMostReviewed: vi.fn(),
      findReviewCountsByPublicIds: vi
        .fn()
        .mockResolvedValue(AlbumReviewCounts.fromRecord({})),
      findTopRated: vi.fn(),
      refreshAll: vi.fn(),
    }

    const gateway = new MongooseAlbumReviewCountGateway(albumChartsRepository)

    const result = await gateway.findCountsByPublicIds([])

    expect(result.forPublicId(PublicId.unsafe('album-a'))).toEqual({
      averageRating: 0,
      reviewCount: 0,
    })
  })
})
