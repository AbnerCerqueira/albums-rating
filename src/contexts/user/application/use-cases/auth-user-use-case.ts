import { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result } from '@/contexts/common/result'
import type { UserRepository } from '../../domain/user-repository'
import { UserId } from '../../domain/value-objects/user-id'
import type { PasswordEncoder } from '../password-encoder'
import { type UserDTO, UserDTOMapper } from '../user-dto'

export type AuthUserUseCase = Promise<
  Result<UserDTO, DomainError.InvalidArgument>
>

const invalidCredentialsError = new DomainError.InvalidArgument(
  'Credenciais inválidas'
)

export class AuthUseUseCase {
  public constructor(
    private readonly repository: UserRepository,
    private readonly passwordEncoder: PasswordEncoder
  ) {}

  public async execute(data: {
    username: string
    password: string
  }): AuthUserUseCase {
    const maybeUserId = UserId.create(data.username)
    if (!maybeUserId.isOk) {
      return err(maybeUserId.error)
    }

    const foundUser = await this.repository.findById(maybeUserId.value)

    if (!foundUser) {
      return err(invalidCredentialsError)
    }

    const isPasswordCorrect = this.passwordEncoder.match(
      data.password,
      foundUser.password.value
    )

    if (!isPasswordCorrect) {
      return err(invalidCredentialsError)
    }

    return ok(UserDTOMapper.toDTO(foundUser))
  }
}
