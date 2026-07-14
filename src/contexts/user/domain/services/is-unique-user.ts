import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export class IsUniqueUserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: UserId): Promise<Result<void, ConflictError>> {
    const existingUser = await this.userRepository.findById(id)
    return existingUser === null
      ? ok(undefined)
      : err(new ConflictError('Email e Username'))
  }
}
