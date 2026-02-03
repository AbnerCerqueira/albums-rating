import z from 'zod'
import { DomainError } from '@/contexts/!common/domain-error'
import { err, ok, type Result, unwrap } from '@/contexts/!common/result'
import type { UserRepository } from '../../domain/user-repository'
import { Email } from '../../domain/value-objects/email'
import type { ApplicationService } from '../password-encoder'
import { type UserDTO, UserDTOMapper } from '../user-dto'

export const zodAuthUserUseCaseRequest = z.object({
  email: z.email(),
  password: z.string(),
})

export type AuthUserUseCaseRequest = z.infer<typeof zodAuthUserUseCaseRequest>

export type AuthUserUseCase = Promise<
  Result<UserDTO, DomainError.InvalidArgument>
>

const invalidCredentialsError = new DomainError.InvalidArgument(
  'Credenciais inválidas'
)

export class AuthUseUseCase {
  public constructor(
    private readonly repository: UserRepository,
    private readonly passwordEncoder: ApplicationService.PasswordEncoder
  ) {}

  public async execute(data: AuthUserUseCaseRequest): AuthUserUseCase {
    const [email, emailErr] = unwrap(Email.create(data.email))
    if (emailErr) {
      return err(emailErr)
    }

    const foundUser = await this.repository.findByEmail(email)
    if (!foundUser) {
      return err(invalidCredentialsError)
    }

    const isPasswordCorrect = await this.passwordEncoder.match(
      data.password,
      foundUser.props.password.value
    )

    if (!isPasswordCorrect) {
      return err(invalidCredentialsError)
    }

    return ok(UserDTOMapper.toDTO(foundUser))
  }
}
