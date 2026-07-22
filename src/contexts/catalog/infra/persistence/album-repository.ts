import type { PipelineStage } from 'mongoose'
import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { PublicId } from '@/contexts/!common/public-id'
import type { Album } from '@/contexts/catalog/domain/album'
import type {
  AlbumRepository,
  SearchAlbumParams,
  SearchGenresParams,
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
    pagination?: Pagination
  ): Promise<PaginatedResult<Album>> {
    const fieldsToSearch = AlbumMapper.toPersistenceSearchFields(params)

    const match = MongooseUtils.buildSearchPipeline(fieldsToSearch, {
      combineWith: 'or',
      matchType: 'startsWith',
    })

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

  async searchGenres(
    params: SearchGenresParams,
    pagination?: Pagination
  ): Promise<PaginatedResult<string>> {
    const fields: Record<string, string> = {}
    if (params.genre) {
      fields.genre = params.genre
    }

    const match = MongooseUtils.buildSearchPipeline(fields, {
      combineWith: 'and',
      matchType: 'startsWith',
    })

    const groupAndSort: PipelineStage[] = [
      { $group: { _id: '$genre' } },
      { $sort: { _id: 1 } },
    ]

    const [countResult] = await this.model.aggregate<{ count: number }>([
      ...match,
      ...groupAndSort,
      { $count: 'count' },
    ])

    const total = countResult?.count ?? 0

    const dataPipeline: PipelineStage[] = [...match, ...groupAndSort]
    if (pagination) {
      dataPipeline.push(
        { $skip: pagination.size * (pagination.page - 1) },
        { $limit: pagination.size }
      )
    }

    const items = await this.model.aggregate<{ _id: string }>(dataPipeline)

    return {
      currentPage: pagination?.page ?? 1,
      items: items.map((r) => r._id),
      size: pagination?.size ?? items.length,
      total,
      totalPages: pagination ? Math.ceil(total / pagination.size) : 1,
    }
  }

  private getFlattenObjOfDomainId(id: AlbumId) {
    return {
      'domainId.artist': id.artist.value,
      'domainId.title': id.title.value,
    }
  }
}
