import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

export class Artist {
  private constructor(readonly value: string) {}

  static create(artist: string): Result<Artist, InvalidArgumentError> {
    const trimmed = artist.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Artista não pode ter nome vazio'))
    }

    return ok(new Artist(trimmed))
  }

  static unsafe(artist: string) {
    return new Artist(artist)
  }

  equals(other: Artist) {
    return this.value === other.value
  }
}
