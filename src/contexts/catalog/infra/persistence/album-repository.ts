import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { SearchStringOptions } from '@/contexts/!common/search-options'
import type { Album } from '@/contexts/catalog/domain/album'
import type {
  AlbumRepository,
  AlbumSearchStringParams,
} from '@/contexts/catalog/domain/album-repository'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { AlbumMapper } from './album-mapper'
import {
  type AlbumData,
  type AlbumDataDomainId,
  AlbumModel,
} from './album-model'

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

  public async find(pagination?: Pagination): Promise<Album[]> {
    const query = this.model.find()

    MongooseUtils.withPagination(query, pagination)

    const docs = await query.exec()

    return docs.map((doc) => AlbumMapper.toDomain(doc))
  }

  public async findByPublicId(publicId: PublicId): Promise<Album | null> {
    const doc = await this.model
      .findOne({ publicId: publicId.toString() })
      .lean()

    return doc ? AlbumMapper.toDomain(doc) : null
  }

  public async searchString(
    params: AlbumSearchStringParams,
    pagination?: Pagination,
    options?: SearchStringOptions
  ): Promise<Album[]> {
    const { artist, genre, title, format } = params

    const fieldsToSearch: Record<string, string | string[]> = {}

    if (artist) {
      fieldsToSearch['domainId.artist'] = artist
    }

    if (genre) {
      fieldsToSearch.genre = genre
    }

    if (title) {
      fieldsToSearch['domainId.title'] = title
    }

    if (format?.length) {
      fieldsToSearch.format = format
    }

    const match = MongooseUtils.buildSearchStringPipeline(
      fieldsToSearch,
      options
    )

    const docs: AlbumData[] = []

    const cursor = match.length
      ? this.model.aggregate<AlbumData>(match)
      : this.model.find().lean()

    MongooseUtils.withPagination(cursor, pagination)

    docs.push(...(await cursor.exec()))

    return docs.map((doc) => AlbumMapper.toDomain(doc))
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
