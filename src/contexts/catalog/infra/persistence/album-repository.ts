import { escapeRegExp } from 'lodash'
import type { FilterQuery } from 'mongoose'
import { MongooseUtils } from '@/contexts/!common/mongoose-utils'
import type { PaginatedResult, Pagination } from '@/contexts/!common/pagination'
import type { Album } from '@/contexts/catalog/domain/album'
import type {
  AlbumRepository,
  SearchAlbumParams,
} from '@/contexts/catalog/domain/album-repository'
import type { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import type { PublicId } from '@/contexts/shared/public-id'
import { AlbumMapper } from './album-mapper'
import { type AlbumData, AlbumModel } from './album-model'
import { GenreMapper } from './genre-mapper'
import type { GenreData } from './genre-model'
import { GenreModel } from './genre-model'

export class MongooseAlbumRepository implements AlbumRepository {
  private readonly model = AlbumModel
  private readonly genreModel = GenreModel

  async save(album: Album): Promise<Album> {
    const data = AlbumMapper.toPersistence(album)
    const genreDocs = await this.genreModel
      .find({ slug: { $in: album.genres.map((g) => g.id.value) } })
      .lean()

    const genreIds = genreDocs.flatMap((g) => (g._id ? [g._id] : []))

    const docToSave: AlbumData = {
      ...data,
      genres: genreIds,
    }

    const filter = {
      artist: data.artist,
      title: data.title,
    }
    const updated = await this.model
      .findOneAndUpdate(filter, docToSave, {
        new: true,
        upsert: true,
      })
      .populate<{ genres: GenreData[] }>('genres')
      .lean()

    if (!updated) {
      throw new Error('Failed to save album')
    }

    const resolvedGenres = updated.genres.map(GenreMapper.toDomain)
    return AlbumMapper.toDomain(updated, resolvedGenres)
  }

  async findById(id: AlbumId): Promise<Album | null> {
    const doc = await this.model
      .findOne({
        artist: id.artist.value,
        title: id.title.value,
      })
      .populate<{ genres: GenreData[] }>('genres')
      .lean()

    if (!doc) {
      return null
    }

    const resolvedGenres = doc.genres.map(GenreMapper.toDomain)
    return AlbumMapper.toDomain(doc, resolvedGenres)
  }

  async find(pagination?: Pagination): Promise<PaginatedResult<Album>> {
    const result = await MongooseUtils.paginateFind<
      AlbumData,
      { genres: GenreData[] }
    >(this.model, {}, pagination, undefined, [{ path: 'genres' }])

    return {
      ...result,
      items: result.items.map((doc) => {
        const resolvedGenres = doc.genres.map(GenreMapper.toDomain)
        return AlbumMapper.toDomain(doc, resolvedGenres)
      }),
    }
  }

  async findByPublicId(publicId: PublicId): Promise<Album | null> {
    const doc = await this.model
      .findOne({ publicId: publicId.value })
      .populate<{ genres: GenreData[] }>('genres')
      .lean()

    if (!doc) {
      return null
    }

    const resolvedGenres = doc.genres.map(GenreMapper.toDomain)
    return AlbumMapper.toDomain(doc, resolvedGenres)
  }

  async search(
    params: SearchAlbumParams,
    pagination?: Pagination
  ): Promise<PaginatedResult<Album>> {
    const filter: FilterQuery<AlbumData> = {}
    const orConditions: FilterQuery<AlbumData>[] = []

    if (params.artist) {
      orConditions.push({
        artist: {
          $options: 'i',
          $regex: `^${escapeRegExp(params.artist)}`,
        },
      })
    }

    if (params.title) {
      orConditions.push({
        title: {
          $options: 'i',
          $regex: `^${escapeRegExp(params.title)}`,
        },
      })
    }

    if (orConditions.length) {
      filter.$or = orConditions
    }

    const result = await MongooseUtils.paginateFind<
      AlbumData,
      { genres: GenreData[] }
    >(this.model, filter, pagination, undefined, [{ path: 'genres' }])

    return {
      ...result,
      items: result.items.map((doc) => {
        const resolvedGenres = doc.genres.map(GenreMapper.toDomain)
        return AlbumMapper.toDomain(doc, resolvedGenres)
      }),
    }
  }
}
