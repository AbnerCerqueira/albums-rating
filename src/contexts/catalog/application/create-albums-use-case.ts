import z from 'zod'
import {
  type ConflictError,
  InvalidArgumentError,
} from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import { slugify } from '@/contexts/!common/slugify'
import { Album, FORMATS } from '../domain/album'
import type { AlbumRepository } from '../domain/album-repository'
import type { Genre } from '../domain/genre'
import type { GenreRepository } from '../domain/genre-repository'
import type { DomainAlbumServices } from '../domain/services/is-unique-album'
import { AlbumId } from '../domain/value-objects/album-id'
import { Artist } from '../domain/value-objects/artist'
import { CoverUrl } from '../domain/value-objects/cover-url'
import { ReleaseDate } from '../domain/value-objects/release-date'
import { Title } from '../domain/value-objects/title'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export const zodCreateAlbumUseCaseRequest = z.object({
  artist: z.string(),
  format: z.enum(FORMATS),
  genres: z.array(z.string()).nonempty(),
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
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository
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

    const releaseDate = ReleaseDate.create(new Date(data.releaseDate))
    if (!releaseDate.ok) {
      return releaseDate
    }

    const genreResults = await Promise.all(
      data.genres.map(async (genreName) => {
        const slug = slugify(genreName)
        const genre = await this.genreRepository.findBySlug(slug)
        return { genre, genreName }
      })
    )

    const genres: Genre[] = []
    for (const { genre, genreName } of genreResults) {
      if (!genre) {
        return err(
          new InvalidArgumentError(
            `Gênero "${genreName}" não encontrado. Crie-o primeiro.`
          )
        )
      }
      genres.push(genre)
    }

    const id = AlbumId.create({ artist: artist.value, title: title.value })

    const coverUrl = CoverUrl.create()

    const album = Album.create({
      coverUrl,
      format: data.format,
      genres,
      id,
      releaseDate: releaseDate.value,
    })

    const isUnique = await this.domainServices.isUnique(album.id)
    if (!isUnique.ok) {
      return isUnique
    }

    const newAlbum = await this.albumRepository.save(album)

    return ok(
      AlbumDTOMapper.toDTO(newAlbum, { averageRating: 0, reviewCount: 0 })
    )
  }
}
