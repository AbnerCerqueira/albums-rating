import z from 'zod'
import type { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result, unwrap } from '@/contexts/common/result'
import { Album, type AlbumProps, FORMATS } from '../domain/album'
import type { AlbumRepository } from '../domain/album-repository'
import type { DomainService } from '../domain/services/is-unique-album'
import { AlbumId } from '../domain/value-objects/album-id'
import { Title } from '../domain/value-objects/title'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export const zodCreateAlbumUseCaseRequest = z.object({
  title: z.string(),
  artist: z.string(),
  releaseDate: z.iso.date(),
  genre: z.string(),
  format: z.enum(FORMATS),
})

export type CreateAlbumUserCaseRequest = z.infer<
  typeof zodCreateAlbumUseCaseRequest
>
export type CreateAlbumUserCaseResponse = Promise<
  Result<AlbumDTO, DomainError.InvalidArgument | DomainError.Conflict>
>

export class CreateAlbumsUseCase {
  public constructor(
    private readonly isUniqueAlbumsService: DomainService.IsUniqueAlbum,
    private readonly repository: AlbumRepository
  ) {}

  public async execute(
    data: CreateAlbumUserCaseRequest
  ): CreateAlbumUserCaseResponse {
    const [title, titleErr] = unwrap(Title.create(data.title))
    if (titleErr) {
      return err(titleErr)
    }

    const albumId = new AlbumId(title, data.artist)
    const albumProps: AlbumProps = {
      format: data.format,
      genre: data.genre,
      releaseDate: new Date(data.releaseDate),
    }

    const album = new Album(albumId, albumProps)

    const isUniqueAlbum = await this.isUniqueAlbumsService.execute(album.id)
    if (!isUniqueAlbum.isOk) {
      return err(isUniqueAlbum.error)
    }

    const newAlbum = await this.repository.create(album)

    return ok(AlbumDTOMapper.toDTO(newAlbum))
  }
}
