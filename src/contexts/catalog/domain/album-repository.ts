import type { Album } from './album'
import type { AlbumId } from './value-objects/album-id'

export interface AlbumRepository {
  create(album: Album): Promise<Album>
  findById(id: AlbumId): Promise<Album | null>
}
