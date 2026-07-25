import { slugify } from '@/contexts/!common/slugify'

export class GenreId {
  private constructor(readonly value: string) {}

  static create(name: string): GenreId {
    return new GenreId(slugify(name))
  }

  static unsafe(slug: string): GenreId {
    return new GenreId(slug)
  }

  equals(other: GenreId): boolean {
    return this.value === other.value
  }
}
