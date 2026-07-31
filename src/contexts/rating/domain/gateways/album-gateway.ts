import type { NotFoundError } from '@/contexts/!common/errors'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Result } from '@/contexts/!common/result'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'

export type AlbumRef = {
  id: AlbumId
}

export interface AlbumGateway {
  findAlbumByPublicId: (
    albumPublicId: PublicId
  ) => Promise<Result<AlbumRef, NotFoundError>>
}
