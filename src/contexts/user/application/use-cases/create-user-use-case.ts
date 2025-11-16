import { DomainError } from '@/contexts/common/domain-error'
import { ApplicationException } from '@/contexts/common/exceptions'
import { err, ok, type Result } from '@/contexts/common/result'
import { User } from '../../domain/user'
import type { UserRepository } from '../../domain/user-repository'
import { Password } from '../../domain/value-objects/password'
import { UserId } from '../../domain/value-objects/user-id'
import type { PasswordEncoder } from '../password-encoder'
import { type UserDTO, UserDTOMapper } from '../user-dto'

export type CreateUserUseCaseResponse = Promise<
  Result<UserDTO, DomainError.InvalidArgument | DomainError.Conflict>
>

export class CreateUserUseCase {
  public constructor(
    private readonly repository: UserRepository,
    private readonly passwordEncoder: PasswordEncoder
  ) {}

  public async execute(data: {
    username: string
    password: string
  }): CreateUserUseCaseResponse {
    const maybeUserId = UserId.create(data.username)

    if (!maybeUserId.isOk) {
      return err(maybeUserId.error)
    }

    const userId = maybeUserId.value
    const existingUser = await this.repository.findById(userId)
    if (existingUser) {
      return err(new DomainError.Conflict('Usuário já existe'))
    }

    const maybePassword = Password.create(data.password)
    if (!maybePassword.isOk) {
      return err(maybePassword.error)
    }

    const plainPassword = maybePassword.value.value
    const hashedPassword = await this.passwordEncoder.encode(plainPassword)
    await this.repository.create(
      new User(userId, Password.unsafeCreate(hashedPassword))
    )

    const newUser = await this.repository.findById(userId)
    if (!newUser) {
      throw new ApplicationException.UnexpectedError({
        options: {
          origin: {
            component: this.constructor.name,
            operation: this.execute.name,
            file: __dirname,
          },
          metadata: { message: 'user not found after create', maybeUserId },
        },
      })
    }

    return ok(UserDTOMapper.toDTO(newUser))
  }
}
