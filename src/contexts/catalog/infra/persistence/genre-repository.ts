import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { Genre } from '@/contexts/catalog/domain/genre'
import type {
  GenreRepository,
  SearchGenresParams,
} from '@/contexts/catalog/domain/genre-repository'
import type { GenreId } from '@/contexts/catalog/domain/value-objects/genre-id'
import { GenreMapper } from './genre-mapper'
import { type GenreData, GenreModel } from './genre-model'

export class MongooseGenreRepository implements GenreRepository {
  private readonly model = GenreModel

  async findBySlug(slug: string): Promise<Genre | null> {
    const doc = await this.model.findOne({ slug }).lean()
    return doc ? GenreMapper.toDomain(doc) : null
  }

  async findByIds(ids: GenreId[]): Promise<Genre[]> {
    const slugs = ids.map((id) => id.value)
    const docs = await this.model.find({ slug: { $in: slugs } }).lean()
    return docs.map((doc) => GenreMapper.toDomain(doc))
  }

  async search(
    params: SearchGenresParams,
    pagination?: Pagination
  ): Promise<PaginatedResult<Genre>> {
    if (!params.name) {
      const result = await MongooseUtils.paginateFind(
        this.model,
        {},
        pagination,
        { name: 1 }
      )

      return {
        ...result,
        items: result.items.map((doc) => GenreMapper.toDomain(doc)),
      }
    }

    const match = MongooseUtils.buildSearchPipeline(
      { name: params.name },
      { combineWith: 'and', matchType: 'startsWith' }
    )

    const result = await MongooseUtils.paginateAggregate(
      this.model,
      match,
      pagination
    )

    return {
      ...result,
      items: result.items.map((doc) => GenreMapper.toDomain(doc)),
    }
  }

  async save(genre: Genre): Promise<Genre> {
    const data = GenreMapper.toPersistence(genre)
    const updated = await this.model
      .findOneAndUpdate({ slug: data.slug }, data, {
        new: true,
        upsert: true,
      })
      .lean()

    return GenreMapper.toDomain(updated as GenreData)
  }
}
