import { NotFoundError } from '@/contexts/!common/errors'
import type { PublicId } from '@/contexts/!common/public-id'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { AlbumRepository } from '../domain/album-repository'
import type { AlbumReviewCountGateway } from '../domain/gateways/album-review-count-gateway'
import type { ImageProvider } from '../domain/image-provider'
import { CoverUrl } from '../domain/value-objects/cover-url'
import { type AlbumDTO, AlbumDTOMapper } from './album-dto'

export type UploadAlbumCoverUseCaseRequest = {
  publicId: PublicId
  buffer: Buffer
  extension: string
}

export type UploadAlbumCoverUseCaseResponse = Promise<
  Result<AlbumDTO, NotFoundError>
>

export class UploadAlbumCoverUseCase {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly imageProvider: ImageProvider,
    private readonly reviewCountGateway: AlbumReviewCountGateway
  ) {}

  async execute(
    data: UploadAlbumCoverUseCaseRequest
  ): UploadAlbumCoverUseCaseResponse {
    const album = await this.albumRepository.findByPublicId(data.publicId)

    if (!album) {
      return err(new NotFoundError('Álbum'))
    }

    const url = await this.imageProvider.upload({
      buffer: data.buffer,
      extension: data.extension,
      publicId: data.publicId.value,
    })

    const updated = await this.albumRepository.save(
      album.setCover(CoverUrl.create(url))
    )

    if (!album.coverUrl.isDefault()) {
      await this.imageProvider.delete(album.coverUrl.value)
    }

    const reviewCounts = await this.reviewCountGateway.findCountsByPublicIds([
      data.publicId,
    ])

    return ok(
      AlbumDTOMapper.toDTO(
        updated,
        reviewCounts[data.publicId.value] ?? {
          averageRating: 0,
          reviewCount: 0,
        }
      )
    )
  }
}
