import { CreateAlbumsUseCase } from '@/contexts/catalog/application/create-albums-use-case'
import { SearchAlbumsUseCase } from '@/contexts/catalog/application/search-albums-use-case'
import { SearchGenresUseCase } from '@/contexts/catalog/application/search-genres-use-case'
import { DomainAlbumServices } from '@/contexts/catalog/domain/services/is-unique-album'
import { MongooseAlbumRepository } from './persistence/album-repository'

const albumRepository = new MongooseAlbumRepository()
const domainAlbumServices = new DomainAlbumServices(albumRepository)

export const createAlbumUseCase = new CreateAlbumsUseCase(
  domainAlbumServices,
  albumRepository
)

export const searchAlbumsUseCase = new SearchAlbumsUseCase(albumRepository)

export const searchGenresUseCase = new SearchGenresUseCase(albumRepository)

export { albumRepository }
