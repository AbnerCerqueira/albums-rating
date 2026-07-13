import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { AlbumRepository } from '../album-repository'
import type { AlbumId } from '../value-objects/album-id'

export class DomainAlbumServices {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async isUnique(id: AlbumId): Promise<Result<void, ConflictError>> {
    const existing = await this.albumRepository.findById(id)
    return existing === null
      ? ok(undefined)
      : err(new ConflictError('Titulo e artista'))
  }
}
