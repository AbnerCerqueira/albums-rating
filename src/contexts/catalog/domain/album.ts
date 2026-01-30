import { PublicId } from '@/contexts/common/public-id'
import type { AlbumId } from './value-objects/album-id'

export const FORMATS = ['LP', 'EP', 'Single', 'Compilation', 'Live'] as const

export type Format = (typeof FORMATS)[number]

export type AlbumProps = {
  releaseDate: Date
  genre: string
  format: Format
}

export class Album {
  public id: AlbumId

  public publicId: PublicId

  public props: AlbumProps

  public constructor(id: AlbumId, props: AlbumProps, publicId?: PublicId) {
    this.id = id
    this.props = props
    this.publicId = publicId ?? new PublicId()
  }
}
