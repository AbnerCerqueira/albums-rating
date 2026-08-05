import type { AlbumReviewCountGateway } from '@/contexts/catalog/domain/gateways/album-review-count-gateway'
import type { AlbumReviewCounts } from '@/contexts/shared/album-review-counts'
import type { PublicId } from '@/contexts/shared/public-id'
import type { AlbumChartsRepository } from '../../domain/album-charts-repository'

export class MongooseAlbumReviewCountGateway
  implements AlbumReviewCountGateway
{
  constructor(private readonly albumChartsRepository: AlbumChartsRepository) {}

  findCountsByPublicIds(publicIds: PublicId[]): Promise<AlbumReviewCounts> {
    return this.albumChartsRepository.findReviewCountsByPublicIds(
      publicIds.map((publicId) => publicId.value)
    )
  }
}
