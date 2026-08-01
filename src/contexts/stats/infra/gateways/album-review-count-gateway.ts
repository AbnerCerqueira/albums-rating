import type { PublicId } from '@/contexts/!common/public-id'
import type {
  AlbumReviewCountGateway,
  AlbumReviewCounts,
} from '@/contexts/catalog/domain/gateways/album-review-count-gateway'
import type { AlbumChartsRepository } from '../../domain/album-charts-repository'

export class MongooseAlbumReviewCountGateway
  implements AlbumReviewCountGateway
{
  constructor(private readonly albumChartsRepository: AlbumChartsRepository) {}

  async findCountsByPublicIds(
    publicIds: PublicId[]
  ): Promise<AlbumReviewCounts> {
    const entries =
      await this.albumChartsRepository.findReviewCountsByPublicIds(
        publicIds.map((publicId) => publicId.value)
      )

    return Object.fromEntries(
      entries.map((entry) => [
        entry.publicId,
        { averageRating: entry.averageRating, reviewCount: entry.reviewCount },
      ])
    )
  }
}
