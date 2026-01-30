import { CreateAlbumsUseCase } from '../../application/create-albums-use-case'
import { isUniqueAlbumService } from './domain-services'
import { albumRepository } from './repositories'

export const createAlbumUseCase = new CreateAlbumsUseCase(
  isUniqueAlbumService,
  albumRepository
)
