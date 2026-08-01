import { CreateAlbumsUseCase } from '@/contexts/catalog/application/create-albums-use-case'
import { CreateGenreUseCase } from '@/contexts/catalog/application/create-genre-use-case'
import { GetAlbumByPublicIdUseCase } from '@/contexts/catalog/application/get-album-by-public-id-use-case'
import { GetAllAlbumsUseCase } from '@/contexts/catalog/application/get-all-albums-use-case'
import { SearchAlbumsUseCase } from '@/contexts/catalog/application/search-albums-use-case'
import { SearchGenresUseCase } from '@/contexts/catalog/application/search-genres-use-case'
import { UploadAlbumCoverUseCase } from '@/contexts/catalog/application/upload-album-cover-use-case'
import { DomainAlbumServices } from '@/contexts/catalog/domain/services/is-unique-album'
import { DomainGenreServices } from '@/contexts/catalog/domain/services/is-unique-genre'
import { MongooseAlbumGateway } from './gateways/album-gateway'
import { MongooseAlbumRepository } from './persistence/album-repository'
import { MongooseGenreRepository } from './persistence/genre-repository'
import { LocalImageProvider } from './providers/local-image-provider'

export const albumRepository = new MongooseAlbumRepository()
export const genreRepository = new MongooseGenreRepository()
export const albumGateway = new MongooseAlbumGateway(albumRepository)
export const domainAlbumServices = new DomainAlbumServices(albumRepository)
export const domainGenreServices = new DomainGenreServices(genreRepository)
export const imageProvider = new LocalImageProvider()

export const createAlbumUseCase = new CreateAlbumsUseCase(
  domainAlbumServices,
  albumRepository,
  genreRepository
)

export const createGenreUseCase = new CreateGenreUseCase(
  domainGenreServices,
  genreRepository
)

export const getAllAlbumsUseCase = new GetAllAlbumsUseCase(albumRepository)

export const getAlbumByPublicIdUseCase = new GetAlbumByPublicIdUseCase(
  albumRepository
)

export const searchAlbumsUseCase = new SearchAlbumsUseCase(albumRepository)

export const searchGenresUseCase = new SearchGenresUseCase(genreRepository)

export const uploadAlbumCoverUseCase = new UploadAlbumCoverUseCase(
  albumRepository,
  imageProvider
)
