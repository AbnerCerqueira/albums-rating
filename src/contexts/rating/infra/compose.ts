import { eventBus } from '@/contexts/!common/event-bus'
import { albumGateway } from '@/contexts/catalog/infra/compose'
import { AlbumModel } from '@/contexts/catalog/infra/persistence/album-model'
import { chartCacheGateway } from '@/contexts/stats/infra/compose'
import { userGateway } from '@/contexts/user/infra/compose'
import { UserModel } from '@/contexts/user/infra/persistence/user-model'
import { CreateReviewUseCase } from '../application/create-review-use-case'
import { DeleteReviewUseCase } from '../application/delete-review-use-case'
import { EditReviewUseCase } from '../application/edit-review-use-case'
import { GetPopularAlbumsUseCase } from '../application/get-popular-albums-use-case'
import { GetReviewsByAlbumUseCase } from '../application/get-reviews-by-album-use-case'
import { GetReviewsByUserUseCase } from '../application/get-reviews-by-user-use-case'
import { GetTopAlbumsUseCase } from '../application/get-top-albums-use-case'
import { DomainReviewServices } from '../domain/services/domain-review-services'
import { MongooseReviewRepository } from './persistence/review-repository'

const reviewRepository = new MongooseReviewRepository(UserModel, AlbumModel)

const domainReviewServices = new DomainReviewServices(reviewRepository)

export const createReviewUseCase = new CreateReviewUseCase(
  reviewRepository,
  domainReviewServices,
  albumGateway,
  userGateway
)

export const deleteReviewUseCase = new DeleteReviewUseCase(
  reviewRepository,
  userGateway
)

export const editReviewUseCase = new EditReviewUseCase(
  reviewRepository,
  userGateway
)

export const getReviewsByAlbumUseCase = new GetReviewsByAlbumUseCase(
  reviewRepository,
  albumGateway
)

export const getReviewsByUserUseCase = new GetReviewsByUserUseCase(
  reviewRepository,
  userGateway
)

export const getPopularAlbumsUseCase = new GetPopularAlbumsUseCase(
  chartCacheGateway,
  eventBus
)
export const getTopAlbumsUseCase = new GetTopAlbumsUseCase(
  chartCacheGateway,
  eventBus
)

export { reviewRepository }
