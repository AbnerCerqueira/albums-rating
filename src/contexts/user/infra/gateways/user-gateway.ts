import { NotFoundError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type {
  UserGateway,
  UserRef,
} from '@/contexts/rating/domain/gateways/user-gateway'
import type { PublicId } from '@/contexts/shared/public-id'
import type { UserRepository } from '../../domain/user-repository'
import { Username } from '../../domain/value-objects/username'

export class MongooseUserGateway implements UserGateway {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByPublicId(
    userPublicId: PublicId
  ): Promise<Result<UserRef, NotFoundError>> {
    const user = await this.userRepository.findByPublicId(userPublicId)
    if (!user) {
      return err(new NotFoundError('Usuário'))
    }
    return ok({ id: user.id })
  }

  async findUserByUsername(
    username: string
  ): Promise<Result<UserRef, NotFoundError>> {
    const user = await this.userRepository.findByUsername(
      Username.unsafe(username)
    )
    if (!user) {
      return err(new NotFoundError('Usuário'))
    }
    return ok({ id: user.id })
  }
}
