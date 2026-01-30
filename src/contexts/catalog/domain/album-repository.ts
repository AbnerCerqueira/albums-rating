import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Album } from './album'
import type { AlbumId } from './value-objects/album-id'

export interface AlbumRepository {
  create(album: Album): Promise<Album>
  findById(id: AlbumId): Promise<Album | null>
  find(pagination: Pagination): Promise<Album[]>
  findByPublicId(publicId: PublicId): Promise<Album | null>
}
