import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

type ReviewIdProps = {
  userId: UserId
  albumId: AlbumId
}

export class ReviewId {
  private constructor(
    readonly userId: UserId,
    readonly albumId: AlbumId
  ) {}

  static create(props: ReviewIdProps): ReviewId {
    return new ReviewId(props.userId, props.albumId)
  }

  equals(other: ReviewId) {
    return (
      this.albumId.equals(other.albumId) && this.userId.equals(other.userId)
    )
  }
}
