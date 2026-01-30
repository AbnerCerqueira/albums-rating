import { DomainError } from '@/contexts/!common/domain-error'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { AlbumRepository } from '../album-repository'
import type { AlbumId } from '../value-objects/album-id'

export namespace DomainService {
  export class IsUniqueAlbum {
    public constructor(private readonly albumRepository: AlbumRepository) {}

    public async execute(
      id: AlbumId
    ): Promise<Result<AlbumId, DomainError.Conflict>> {
      const existingAlbum = await this.albumRepository.findById(id)
      return existingAlbum === null
        ? ok(id)
        : err(new DomainError.Conflict('Album já existe'))
    }
  }
}
