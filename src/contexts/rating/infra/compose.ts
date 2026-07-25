import { AlbumModel } from '@/contexts/catalog/infra/persistence/album-model'
import { MongooseAlbumRepository } from '@/contexts/catalog/infra/persistence/album-repository'
import { UserModel } from '@/contexts/user/infra/persistence/user-model'
import { MongooseUserRepository } from '@/contexts/user/infra/persistence/user-repository'
import { CreateReviewUseCase } from '../application/create-review-use-case'
import { DeleteReviewUseCase } from '../application/delete-review-use-case'
import { EditReviewUseCase } from '../application/edit-review-use-case'
import { DomainReviewServices } from '../domain/services/domain-review-services'
import { MongooseReviewGateway } from './gateways/mongoose-review-gateway'
import { MongooseReviewRepository } from './persistence/review-repository'

const reviewRepository = new MongooseReviewRepository(UserModel, AlbumModel)
const userRepository = new MongooseUserRepository()
const albumRepository = new MongooseAlbumRepository()

const reviewGateway = new MongooseReviewGateway(
  reviewRepository,
  userRepository,
  albumRepository
)

const domainReviewServices = new DomainReviewServices(
  reviewRepository,
  reviewGateway
)

export const createReviewUseCase = new CreateReviewUseCase(
  reviewRepository,
  domainReviewServices
)

export const deleteReviewUseCase = new DeleteReviewUseCase(
  reviewRepository,
  domainReviewServices
)

export const editReviewUseCase = new EditReviewUseCase(
  reviewRepository,
  domainReviewServices
)

export { albumRepository, reviewGateway, reviewRepository }
