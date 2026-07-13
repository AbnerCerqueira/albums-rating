import { ConflictError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { Email } from '@/contexts/user/domain/value-objects/email'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Username } from '@/contexts/user/domain/value-objects/username'

export class DomainUserServices {
  constructor(private readonly userRepository: UserRepository) {}

  async isEmailUnique(email: Email): Promise<Result<void, ConflictError>> {
    const existing = await this.userRepository.findByEmail(email)
    return existing === null ? ok(undefined) : err(new ConflictError('Email'))
  }

  async isUsernameUnique(
    username: Username
  ): Promise<Result<void, ConflictError>> {
    const existing = await this.userRepository.findByUsername(username)
    return existing === null
      ? ok(undefined)
      : err(new ConflictError('Username'))
  }

  async isUserUnique(id: UserId): Promise<Result<void, ConflictError>> {
    const existing = await this.userRepository.findById(id)
    return existing === null
      ? ok(undefined)
      : err(new ConflictError('Email e Username'))
  }
}
