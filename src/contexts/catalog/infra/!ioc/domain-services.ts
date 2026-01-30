import { DomainService } from '../../domain/services/is-unique-album'
import { albumRepository } from './repositories'

export const isUniqueAlbumService = new DomainService.IsUniqueAlbum(
  albumRepository
)
