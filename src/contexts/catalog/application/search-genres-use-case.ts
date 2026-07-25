import type { Pagination } from '@/contexts/!common/pagination'
import type { GenreRepository } from '../domain/genre-repository'
import { type GenreDTO, GenreDTOMapper } from './genre-dto'

export type SearchGenresUseCaseRequest = {
  name?: string
  pagination?: Pagination
}

export type SearchGenresUseCaseResponse = Promise<{
  genres: GenreDTO[]
  currentPage?: number
  size?: number
  total?: number
  totalPages?: number
}>

export class SearchGenresUseCase {
  constructor(private readonly repository: GenreRepository) {}

  async execute(data: SearchGenresUseCaseRequest): SearchGenresUseCaseResponse {
    const { name, pagination } = data

    const result = await this.repository.search({ name }, pagination)

    return {
      currentPage: result.currentPage,
      genres: result.items.map(GenreDTOMapper.toDTO),
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    }
  }
}
