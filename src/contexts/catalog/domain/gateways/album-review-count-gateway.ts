import type { PublicId } from '@/contexts/!common/public-id'

export type AlbumReviewCounts = Record<
  PublicId['value'],
  { averageRating: number; reviewCount: number }
>

export interface AlbumReviewCountGateway {
  findCountsByPublicIds: (publicIds: PublicId[]) => Promise<AlbumReviewCounts>
}
