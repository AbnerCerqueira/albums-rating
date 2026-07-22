import type { Pagination } from '@/contexts/!common/pagination'
import type { AlbumRepository } from '../domain/album-repository'

export type SearchGenresUseCaseRequest = {
  genre?: string
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
    const { genre, pagination } = data

    const result = await this.repository.searchGenres({ genre }, pagination)

    return {
      currentPage: result.currentPage,
      genres: result.items,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
