import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { GenreRepository } from '../genre-repository'
import type { GenreId } from '../value-objects/genre-id'

export class DomainGenreServices {
  constructor(private readonly genreRepository: GenreRepository) {}

  async isUnique(id: GenreId): Promise<Result<void, ConflictError>> {
    const existing = await this.genreRepository.findBySlug(id.value)
    return existing === null ? ok(undefined) : err(new ConflictError('Gênero'))
  }
}
