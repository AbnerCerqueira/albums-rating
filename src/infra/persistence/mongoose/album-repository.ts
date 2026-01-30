import type { Album } from '@/contexts/catalog/domain/album'
import type { AlbumRepository } from '@/contexts/catalog/domain/album-repository'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { AlbumMapper } from './album-mapper'
import { type AlbumDataDomainId, AlbumModel } from './album-model'

export class MongooseAlbumRepository implements AlbumRepository {
  private readonly model = AlbumModel

  public async create(album: Album): Promise<Album> {
    const data = AlbumMapper.toPersistence(album)
    const newAlbum = await this.model.create(data)

    return AlbumMapper.toDomain(newAlbum.toObject())
  }

  public async findById(id: AlbumId): Promise<Album | null> {
    const foundAlbum = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundAlbum ? AlbumMapper.toDomain(foundAlbum) : null
  }

  private getFlattenObjOfDomainId(id: AlbumId) {
    const domainId: AlbumDataDomainId = {
      artist: id.artist,
      title: id.title.value,
    }

    return {
      'domainId.title': domainId.title,
      'domainId.artist': domainId.artist,
    }
  }
}
