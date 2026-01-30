import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'
import type { Album } from '../album'
import type { AlbumRepository } from '../album-repository'

export namespace DomainService {
  export class IsUniqueAlbum {
    public constructor(private readonly albumRepository: AlbumRepository) {}

    public async execute(
      album: Album
    ): Promise<Result<Album, DomainError.Conflict>> {
      const existingAlbum = await this.albumRepository.findById(album.id)
      return existingAlbum === null
        ? ok(album)
        : err(new DomainError.Conflict('Album já existe'))
    }
  }
}
