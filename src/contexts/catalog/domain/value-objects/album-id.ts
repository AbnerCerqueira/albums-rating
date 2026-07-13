import type { Artist } from './artist'
import type { Title } from './title'

export type AlbumIdProps = {
  title: Title
  artist: Artist
}

export class AlbumId {
  private constructor(
    readonly title: Title,
    readonly artist: Artist
  ) {}

  static create(props: AlbumIdProps) {
    return new AlbumId(props.title, props.artist)
  }

  equals(other: AlbumId): boolean {
    return this.title.equals(other.title) && this.artist.equals(other.artist)
  }
}
