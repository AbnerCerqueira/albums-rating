import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export class ReviewId {
  public constructor(
    public readonly userId: UserId,
    public readonly albumId: AlbumId
  ) {}
}
