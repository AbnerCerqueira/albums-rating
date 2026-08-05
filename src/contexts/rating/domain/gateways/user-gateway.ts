import type { NotFoundError } from '@/contexts/!common/errors'
import type { Result } from '@/contexts/!common/result'
import type { PublicId } from '@/contexts/shared/public-id'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export type UserRef = {
  id: UserId
}

export interface UserGateway {
  findUserByPublicId: (
    userPublicId: PublicId
  ) => Promise<Result<UserRef, NotFoundError>>

  findUserByUsername: (
    username: string
  ) => Promise<Result<UserRef, NotFoundError>>
}
