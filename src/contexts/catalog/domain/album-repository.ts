import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { SearchStringOptions } from '@/contexts/!common/search-options'
import type { Album, Format } from './album'
import type { AlbumId } from './value-objects/album-id'

export type AlbumSearchStringParams = {
  title?: string
  artist?: string
  genre?: string
  format?: Format[]
}

export interface AlbumRepository {
  create(album: Album): Promise<Album>
  findById(id: AlbumId): Promise<Album | null>
  find(pagination?: Pagination): Promise<Album[]>
  findByPublicId(publicId: PublicId): Promise<Album | null>
  searchString(
    params: AlbumSearchStringParams,
    pagination?: Pagination,
    options?: SearchStringOptions
  ): Promise<Album[]>
}
