import { DomainError } from '@/contexts/!common/domain-error'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { UserRepository } from '../user-repository'
import type { Email } from '../value-objects/email'

export namespace DomainService {
  export class IsUniqueEmail {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(
      email: Email
    ): Promise<Result<Email, DomainError.Conflict>> {
      const existingUser = await this.userRepository.findByEmail(email)
      return existingUser === null
        ? ok(email)
        : err(new DomainError.Conflict('Usuário já existe'))
    }
  }
}
