import { PublicId } from '@/contexts/shared/public-id'
import type { GenreId } from './value-objects/genre-id'
import type { GenreName } from './value-objects/genre-name'

export type GenreProps = {
  id: GenreId
  name: GenreName
}

export type GenrePersistenceProps = GenreProps & {
  publicId: PublicId
  createdAt: Date
  updatedAt: Date
}

export class Genre {
  private constructor(
    readonly id: GenreId,
    readonly name: GenreName,
    readonly publicId: PublicId,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  get slug(): string {
    return this.id.value
  }

  getCreationDate(): Date {
    return new Date(this.createdAt.getTime())
  }

  getUpdateDate(): Date {
    return new Date(this.updatedAt.getTime())
  }

  static create(props: GenreProps): Genre {
    return new Genre(
      props.id,
      props.name,
      PublicId.create(),
      new Date(),
      new Date()
    )
  }

  static fromPersistence(props: GenrePersistenceProps): Genre {
    return new Genre(
      props.id,
      props.name,
      props.publicId,
      new Date(props.createdAt),
      new Date(props.updatedAt)
    )
  }

  equals(other: Genre): boolean {
    return this.id.equals(other.id)
  }
}
