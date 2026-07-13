import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export class IsUniqueEmailService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(email: UserId['email']): Promise<Result<void, ConflictError>> {
    const existingEmail = await this.userRepository.findByEmail(email)

    return existingEmail === null
      ? ok(undefined)
      : err(new ConflictError('Email'))
  }
}
