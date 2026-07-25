import type {
  ConflictError,
  InvalidArgumentError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import { Genre } from '../domain/genre'
import type { GenreRepository } from '../domain/genre-repository'
import type { DomainGenreServices } from '../domain/services/is-unique-genre'
import { GenreId } from '../domain/value-objects/genre-id'
import { GenreName } from '../domain/value-objects/genre-name'
import { type GenreDTO, GenreDTOMapper } from './genre-dto'

export type CreateGenreUseCaseRequest = {
  name: string
}

export type CreateGenreUseCaseResponse = Promise<
  Result<GenreDTO, InvalidArgumentError | ConflictError>
>

export class CreateGenreUseCase {
  constructor(
    private readonly domainServices: DomainGenreServices,
    private readonly repository: GenreRepository
  ) {}

  async execute(data: CreateGenreUseCaseRequest): CreateGenreUseCaseResponse {
    const genreName = GenreName.create(data.name)
    if (!genreName.ok) {
      return genreName
    }

    const genreId = GenreId.create(data.name)

    const isUnique = await this.domainServices.isUnique(genreId)
    if (!isUnique.ok) {
      return isUnique
    }

    const genre = Genre.create({ id: genreId, name: genreName.value })

    const saved = await this.repository.save(genre)

    return ok(GenreDTOMapper.toDTO(saved))
  }
}
