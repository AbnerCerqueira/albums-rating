import type { NotFoundError } from '@/contexts/!common/errors'
import type { Result } from '@/contexts/!common/result'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { PublicId } from '@/contexts/shared/public-id'

export type AlbumRef = {
  id: AlbumId
}

export interface AlbumGateway {
  findAlbumByPublicId: (
    albumPublicId: PublicId
  ) => Promise<Result<AlbumRef, NotFoundError>>
}
