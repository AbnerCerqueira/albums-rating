import z from 'zod'
import { InvalidCredentialsError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { PasswordEncoderService } from '@/contexts/user/application/services/password-encoder-service'
import {
  type UserDTO,
  UserDTOMapper,
} from '@/contexts/user/application/user-dto'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import { Email } from '@/contexts/user/domain/value-objects/email'

export const zodAuthUserUseCaseRequest = z.object({
  email: z.email(),
  password: z.string(),
})

export type AuthUserUseCaseRequest = z.infer<typeof zodAuthUserUseCaseRequest>

export type AuthUserUseCaseResponse = Promise<
  Result<UserDTO, InvalidCredentialsError>
>

export class AuthUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncoderService: PasswordEncoderService
  ) {}

  async execute(data: AuthUserUseCaseRequest): AuthUserUseCaseResponse {
    const email = Email.unsafe(data.email)

    const foundUser = await this.userRepository.findByEmail(email)
    if (!foundUser) {
      return err(new InvalidCredentialsError())
    }

    const matchPassword = await this.passwordEncoderService.match(
      data.password,
      foundUser.password.value
    )
    if (!matchPassword) {
      return err(new InvalidCredentialsError())
    }

    return ok(UserDTOMapper.toDTO(foundUser))
  }
}
