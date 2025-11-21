import type { DomainError } from '@/contexts/common/domain-error'
import { err, ok, type Result, unwrap } from '@/contexts/common/result'
import type { DomainService } from '../../domain/services/is-unique-user'
import { User } from '../../domain/user'
import type { UserRepository } from '../../domain/user-repository'
import { Email } from '../../domain/value-objects/email'
import { Password } from '../../domain/value-objects/password'
import { Username } from '../../domain/value-objects/username'
import type { ApplicationService } from '../password-encoder'
import { type UserDTO, UserDTOMapper } from '../user-dto'

export type CreateUserUseCaseInput = {
  email: string
  username: string
  password: string
}

export type CreateUserUseCaseResponse = Promise<
  Result<UserDTO, DomainError.InvalidArgument | DomainError.Conflict>
>

export class CreateUserUseCase {
  public constructor(
    private readonly isUniqueUserService: DomainService.IsUniqueUser,
    private readonly passwordEncoder: ApplicationService.PasswordEncoder,
    private readonly repository: UserRepository
  ) {}

  public async execute(
    data: CreateUserUseCaseInput
  ): CreateUserUseCaseResponse {
    const [email, emailErr] = unwrap(Email.create(data.email))
    if (emailErr) {
      return err(emailErr)
    }

    const isUniqueUser = await this.isUniqueUserService.execute(email)
    if (!isUniqueUser.isOk) {
      return err(isUniqueUser.error)
    }

    const [username, usernameErr] = unwrap(Username.create(data.username))
    if (usernameErr) {
      return err(usernameErr)
    }

    const [plainPassword, passwordErr] = unwrap(Password.create(data.password))
    if (passwordErr) {
      return err(passwordErr)
    }

    const hash = await this.passwordEncoder.encode(plainPassword.value)

    const newUser = await this.repository.create(
      new User({ email, username, password: Password.unsafeCreate(hash) })
    )

    return ok(UserDTOMapper.toDTO(newUser))
  }
}
