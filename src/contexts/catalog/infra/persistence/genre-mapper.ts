import { Genre } from '@/contexts/catalog/domain/genre'
import { GenreId } from '@/contexts/catalog/domain/value-objects/genre-id'
import { GenreName } from '@/contexts/catalog/domain/value-objects/genre-name'
import { PublicId } from '@/contexts/shared/public-id'
import type { GenreData } from './genre-model'

function toDomain(data: GenreData): Genre {
  return Genre.fromPersistence({
    createdAt: data.createdAt,
    id: GenreId.unsafe(data.slug),
    name: GenreName.unsafe(data.name),
    publicId: PublicId.unsafe(data.publicId),
    updatedAt: data.updatedAt,
  })
}

function toPersistence(genre: Genre): GenreData {
  return {
    createdAt: genre.getCreationDate(),
    name: genre.name.value,
    publicId: genre.publicId.value,
    slug: genre.slug,
    updatedAt: genre.getUpdateDate(),
  }
}

export const GenreMapper = { toDomain, toPersistence }
