import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'
import type { UserRepository } from '../user-repository'
import type { UserId } from '../value-objects/user-id'

export namespace DomainService {
  export class IsUniqueUser {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(
      id: UserId
    ): Promise<Result<UserId, DomainError.Conflict>> {
      const existingUser = await this.userRepository.findById(id)
      return existingUser === null
        ? ok(id)
        : err(new DomainError.Conflict('Usuário já existe'))
    }
  }
}
