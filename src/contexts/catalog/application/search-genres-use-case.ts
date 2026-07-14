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
}>

export class SearchGenresUseCase {
  constructor(private readonly repository: AlbumRepository) {}

  async execute(data: SearchGenresUseCaseRequest): SearchGenresUseCaseResponse {
    const { genre, matchType, pagination } = data

    const albums = await this.repository.search({ genre }, pagination, {
      combineWith: 'and',
      matchType,
    })

    const uniqueGenres = [...new Set(albums.map((a) => a.genre.value))]

    return {
      currentPage: pagination?.page,
      genres: uniqueGenres,
      size: pagination?.size,
    }
  }
}
