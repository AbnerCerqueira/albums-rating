import type { PublicId } from './public-id'

export type AlbumReviewCount = {
  averageRating: number
  reviewCount: number
}

const EMPTY: AlbumReviewCount = { averageRating: 0, reviewCount: 0 }

export class AlbumReviewCounts {
  private constructor(
    private readonly counts: Record<string, AlbumReviewCount>
  ) {}

  static fromRecord(
    record: Record<string, AlbumReviewCount>
  ): AlbumReviewCounts {
    return new AlbumReviewCounts(record)
  }

  forPublicId(publicId: PublicId): AlbumReviewCount {
    return this.counts[publicId.value] ?? EMPTY
  }
}
