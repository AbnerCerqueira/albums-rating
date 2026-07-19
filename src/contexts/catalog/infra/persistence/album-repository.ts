import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { SearchOptions } from '@/contexts/!common/search-options'
import type { Album } from '@/contexts/catalog/domain/album'
import type {
  AlbumRepository,
  SearchAlbumParams,
} from '@/contexts/catalog/domain/album-repository'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { AlbumMapper } from './album-mapper'
import { type AlbumData, AlbumModel } from './album-model'

export class MongooseAlbumRepository implements AlbumRepository {
  private readonly model = AlbumModel

  async save(album: Album): Promise<Album> {
    const data = AlbumMapper.toPersistence(album)
    const filter = {
      'domainId.artist': data.domainId.artist,
      'domainId.title': data.domainId.title,
    }
    const updated = await this.model
      .findOneAndUpdate(filter, data, {
        new: true,
        upsert: true,
      })
      .lean()

    return AlbumMapper.toDomain(updated)
  }

  async findById(id: AlbumId): Promise<Album | null> {
    const foundAlbum = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundAlbum ? AlbumMapper.toDomain(foundAlbum) : null
  }

  async find(pagination?: Pagination): Promise<PaginatedResult<Album>> {
    const result = await MongooseUtils.paginateFind(this.model, {}, pagination)

    return {
      ...result,
      items: result.items.map((doc) => AlbumMapper.toDomain(doc)),
    }
  }

  async findByPublicId(publicId: PublicId): Promise<Album | null> {
    const doc = await this.model.findOne({ publicId: publicId.value }).lean()

    return doc ? AlbumMapper.toDomain(doc) : null
  }

  async search(
    params: SearchAlbumParams,
    pagination?: Pagination,
    options?: SearchOptions
  ): Promise<PaginatedResult<Album>> {
    const fieldsToSearch = AlbumMapper.toPersistenceSearchFields(params)

    const match = MongooseUtils.buildSearchPipeline(fieldsToSearch, options)

    let result: PaginatedResult<AlbumData>

    if (match.length) {
      result = await MongooseUtils.paginateAggregate(
        this.model,
        match,
        pagination
      )
    } else {
      result = await MongooseUtils.paginateFind(this.model, {}, pagination)
    }

    return {
      ...result,
      items: result.items.map((doc) => AlbumMapper.toDomain(doc)),
    }
  }

  private getFlattenObjOfDomainId(id: AlbumId) {
    return {
      'domainId.artist': id.artist.value,
      'domainId.title': id.title.value,
    }
  }
}
