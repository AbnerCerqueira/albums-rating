import type { Pagination } from '@/contexts/!common/pagination'
import type { SearchOptions } from '@/contexts/!common/search-options'
import type { Format } from '../domain/album'
import type { AlbumRepository } from '../domain/album-repository'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export type SearchAlbumsUseCaseRequest = {
  artist?: string
  title?: string
  genre?: string
  format?: Format[]
  matchType: SearchOptions['matchType']
  combineWith: SearchOptions['combineWith']
  pagination?: Pagination
}

export type SearchAlbumsUseCaseResponse = Promise<{
  albums: AlbumDTO[]
  currentPage?: number
  size?: number
}>

export class SearchAlbumsUseCase {
  constructor(private readonly repository: AlbumRepository) {}

  async execute(data: SearchAlbumsUseCaseRequest): SearchAlbumsUseCaseResponse {
    const { artist, title, genre, format, matchType, combineWith, pagination } =
      data

    const albums = await this.repository.search(
      { artist, format, genre, title },
      pagination,
      { combineWith, matchType }
    )

    return {
      albums: albums.map((a) => AlbumDTOMapper.toDTO(a)),
      currentPage: pagination?.page,
      size: pagination?.size,
    }
  }
}
