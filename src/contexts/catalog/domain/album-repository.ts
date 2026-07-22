import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Album } from './album'
import type { AlbumId } from './value-objects/album-id'

export type SearchAlbumParams = {
  title?: string
  artist?: string
}

export type SearchGenresParams = {
  genre?: string
}

export interface AlbumRepository {
  find: (pagination?: Pagination) => Promise<PaginatedResult<Album>>
  findById: (id: AlbumId) => Promise<Album | null>
  findByPublicId: (publicId: PublicId) => Promise<Album | null>
  save: (album: Album) => Promise<Album>
  search: (
    params: SearchAlbumParams,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Album>>
  searchGenres: (
    params: SearchGenresParams,
    pagination?: Pagination
  ) => Promise<PaginatedResult<string>>
}
