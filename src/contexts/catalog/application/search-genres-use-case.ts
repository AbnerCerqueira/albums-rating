import type { Pagination } from '@/contexts/!common/pagination'
import type { SearchOptions } from '@/contexts/!common/search-options'
import type { AlbumRepository } from '../domain/album-repository'

export type SearchGenresUseCaseRequest = {
  genre?: string
  matchType: SearchOptions['matchType']
  pagination?: Pagination
}

export type SearchGenresUseCaseResponse = Promise<{
  genres: string[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}>

export class SearchGenresUseCase {
  constructor(private readonly repository: AlbumRepository) {}

  async execute(data: SearchGenresUseCaseRequest): SearchGenresUseCaseResponse {
    const { genre, matchType, pagination } = data

    const result = await this.repository.search({ genre }, pagination, {
      combineWith: 'and',
      matchType,
    })

    const uniqueGenres = [...new Set(result.items.map((a) => a.genre.value))]

    return {
      currentPage: result.currentPage,
      genres: uniqueGenres,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
