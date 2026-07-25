import { PublicId } from '@/contexts/!common/public-id'
import { slugify } from '@/contexts/!common/slugify'
import type { Genre } from './genre'
import type { AlbumId } from './value-objects/album-id'
import type { ReleaseDate } from './value-objects/release-date'

export const FORMATS = ['LP', 'EP', 'Single', 'Compilation', 'Live'] as const

export type Format = (typeof FORMATS)[number]

export type AlbumProps = {
  id: AlbumId
  format: Format
  genres: Genre[]
  releaseDate: ReleaseDate
}

export type AlbumPersistenceProps = AlbumProps & {
  publicId: PublicId
  createdAt: Date
  updatedAt: Date
}

export class Album {
  private constructor(
    readonly id: AlbumId,
    readonly format: Format,
    readonly genres: Genre[],
    readonly releaseDate: ReleaseDate,
    readonly publicId: PublicId,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  getCreationDate(): Date {
    return new Date(this.createdAt.getTime())
  }

  getUpdateDate(): Date {
    return new Date(this.updatedAt.getTime())
  }

  static create(props: AlbumProps) {
    const slug = `${slugify(props.id.artist.value)}-${slugify(props.id.title.value)}`
    return new Album(
      props.id,
      props.format,
      props.genres,
      props.releaseDate,
      PublicId.create(slug),
      new Date(),
      new Date()
    )
  }

  static fromPersistence(props: AlbumPersistenceProps): Album {
    return new Album(
      props.id,
      props.format,
      props.genres,
      props.releaseDate,
      props.publicId,
      new Date(props.createdAt),
      new Date(props.updatedAt)
    )
  }

  equals(other: Album) {
    return this.id.equals(other.id)
  }
}
