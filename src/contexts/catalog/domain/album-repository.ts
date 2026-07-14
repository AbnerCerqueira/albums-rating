import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { SearchOptions } from '@/contexts/!common/search-options'
import type { Album, Format } from './album'
import type { AlbumId } from './value-objects/album-id'

export type SearchAlbumParams = {
  title?: string
  artist?: string
  genre?: string
  format?: Format[]
}

export interface AlbumRepository {
  find: (pagination?: Pagination) => Promise<Album[]>
  findById: (id: AlbumId) => Promise<Album | null>
  findByPublicId: (publicId: PublicId) => Promise<Album | null>
  save: (album: Album) => Promise<Album>
  search: (
    params: SearchAlbumParams,
    pagination?: Pagination,
    options?: SearchOptions
  ) => Promise<Album[]>
}
