import type { AlbumReviewCounts } from '@/contexts/shared/album-review-counts'
import type { PublicId } from '@/contexts/shared/public-id'

export interface AlbumReviewCountGateway {
  findCountsByPublicIds: (publicIds: PublicId[]) => Promise<AlbumReviewCounts>
}
