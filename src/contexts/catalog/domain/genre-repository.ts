import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { Genre } from './genre'
import type { GenreId } from './value-objects/genre-id'

export type SearchGenresParams = {
  name?: string
}

export interface GenreRepository {
  findByIds: (ids: GenreId[]) => Promise<Genre[]>
  findBySlug: (slug: string) => Promise<Genre | null>
  save: (genre: Genre) => Promise<Genre>
  search: (
    params: SearchGenresParams,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Genre>>
}
