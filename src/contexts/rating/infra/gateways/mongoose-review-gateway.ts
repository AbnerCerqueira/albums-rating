import { NotFoundError } from '@/contexts/!common/errors'
import type { PublicId } from '@/contexts/!common/public-id'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { Album } from '@/contexts/catalog/domain/album'
import type { AlbumRepository } from '@/contexts/catalog/domain/album-repository'
import type {
  ReviewGateway,
  UserAndAlbum,
  UserAndReview,
} from '@/contexts/rating/domain/gateways/review-gateway'
import type { ReviewRepository } from '@/contexts/rating/domain/review-repository'
import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import { Username } from '@/contexts/user/domain/value-objects/username'

export class MongooseReviewGateway implements ReviewGateway {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly albumRepository: AlbumRepository
  ) {}

  async findAlbumByPublicId(
    albumPublicId: PublicId
  ): Promise<Result<Album, NotFoundError>> {
    const album = await this.albumRepository.findByPublicId(albumPublicId)
    if (!album) {
      return err(new NotFoundError('Álbum'))
    }
    return ok(album)
  }

  async findUserAndReviewForEdit(
    userPublicId: PublicId,
    reviewPublicId: PublicId
  ): Promise<Result<UserAndReview, NotFoundError>> {
    const user = await this.userRepository.findByPublicId(userPublicId)
    if (!user) {
      return err(new NotFoundError('Usuário'))
    }

    const review = await this.reviewRepository.findByPublicId(reviewPublicId)
    if (!review) {
      return err(new NotFoundError('Review'))
    }

    return ok({ review, user })
  }

  async findUserAndAlbumForReview(
    userPublicId: PublicId,
    albumPublicId: PublicId
  ): Promise<Result<UserAndAlbum, NotFoundError>> {
    const user = await this.userRepository.findByPublicId(userPublicId)
    if (!user) {
      return err(new NotFoundError('Usuário'))
    }

    const album = await this.albumRepository.findByPublicId(albumPublicId)
    if (!album) {
      return err(new NotFoundError('Álbum'))
    }

    return ok({ album, user })
  }

  async findUserByUsername(
    username: string
  ): Promise<Result<User, NotFoundError>> {
    const user = await this.userRepository.findByUsername(
      Username.unsafe(username)
    )
    if (!user) {
      return err(new NotFoundError('Usuário'))
    }
    return ok(user)
  }
}
