import type { Title } from './title'

export class AlbumId {
  public constructor(
    public readonly title: Title,
    public readonly artist: string
  ) {}
}
