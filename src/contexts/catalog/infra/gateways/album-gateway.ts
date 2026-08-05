import { NotFoundError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type {
  AlbumGateway,
  AlbumRef,
} from '@/contexts/rating/domain/gateways/album-gateway'
import type { PublicId } from '@/contexts/shared/public-id'
import type { AlbumRepository } from '../../domain/album-repository'

export class MongooseAlbumGateway implements AlbumGateway {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async findAlbumByPublicId(
    albumPublicId: PublicId
  ): Promise<Result<AlbumRef, NotFoundError>> {
    const album = await this.albumRepository.findByPublicId(albumPublicId)
    if (!album) {
      return err(new NotFoundError('Álbum'))
    }
    return ok({ id: album.id })
  }
}
