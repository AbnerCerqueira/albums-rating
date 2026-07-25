import { CreateAlbumsUseCase } from '@/contexts/catalog/application/create-albums-use-case'
import { CreateGenreUseCase } from '@/contexts/catalog/application/create-genre-use-case'
import { SearchAlbumsUseCase } from '@/contexts/catalog/application/search-albums-use-case'
import { SearchGenresUseCase } from '@/contexts/catalog/application/search-genres-use-case'
import { DomainAlbumServices } from '@/contexts/catalog/domain/services/is-unique-album'
import { DomainGenreServices } from '@/contexts/catalog/domain/services/is-unique-genre'
import { MongooseAlbumRepository } from './persistence/album-repository'
import { MongooseGenreRepository } from './persistence/genre-repository'

export const albumRepository = new MongooseAlbumRepository()
export const genreRepository = new MongooseGenreRepository()
export const domainAlbumServices = new DomainAlbumServices(albumRepository)
export const domainGenreServices = new DomainGenreServices(genreRepository)

export const createAlbumUseCase = new CreateAlbumsUseCase(
  domainAlbumServices,
  albumRepository,
  genreRepository
)

export const createGenreUseCase = new CreateGenreUseCase(
  domainGenreServices,
  genreRepository
)

export const searchAlbumsUseCase = new SearchAlbumsUseCase(albumRepository)

export const searchGenresUseCase = new SearchGenresUseCase(genreRepository)
