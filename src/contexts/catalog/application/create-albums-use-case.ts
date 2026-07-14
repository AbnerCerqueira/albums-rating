import z from 'zod'
import type {
  ConflictError,
  InvalidArgumentError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import { Album, FORMATS } from '../domain/album'
import type { AlbumRepository } from '../domain/album-repository'
import type { DomainAlbumServices } from '../domain/services/is-unique-album'
import { AlbumId } from '../domain/value-objects/album-id'
import { Artist } from '../domain/value-objects/artist'
import { Genre } from '../domain/value-objects/genre'
import { ReleaseDate } from '../domain/value-objects/release-date'
import { Title } from '../domain/value-objects/title'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export const zodCreateAlbumUseCaseRequest = z.object({
  artist: z.string(),
  format: z.enum(FORMATS),
  genre: z.string(),
  releaseDate: z.iso.date(),
  title: z.string(),
})

export type CreateAlbumUserCaseRequest = z.infer<
  typeof zodCreateAlbumUseCaseRequest
>
export type CreateAlbumUserCaseResponse = Promise<
  Result<AlbumDTO, InvalidArgumentError | ConflictError>
>

export class CreateAlbumsUseCase {
  constructor(
    private readonly domainServices: DomainAlbumServices,
    private readonly repository: AlbumRepository
  ) {}

  async execute(data: CreateAlbumUserCaseRequest): CreateAlbumUserCaseResponse {
    const title = Title.create(data.title)
    if (!title.ok) {
      return title
    }

    const artist = Artist.create(data.artist)
    if (!artist.ok) {
      return artist
    }

    const genre = Genre.create(data.genre)
    if (!genre.ok) {
      return genre
    }

    const releaseDate = ReleaseDate.create(new Date(data.releaseDate))
    if (!releaseDate.ok) {
      return releaseDate
    }

    const id = AlbumId.create({ artist: artist.value, title: title.value })

    const album = Album.create({
      format: data.format,
      genre: genre.value,
      id,
      releaseDate: releaseDate.value,
    })

    const isUnique = await this.domainServices.isUnique(album.id)
    if (!isUnique.ok) {
      return isUnique
    }

    const newAlbum = await this.repository.save(album)

    return ok(AlbumDTOMapper.toDTO(newAlbum))
  }
}
