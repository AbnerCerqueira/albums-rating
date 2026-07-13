import z from 'zod'
import { InvalidCredentialsError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'
import type { PasswordEncoderService } from '@/contexts/user/application/services/password-encoder-service'
import { toDTO, type UserDTO } from '@/contexts/user/application/user-dto'
import type { UserRepository } from '@/contexts/user/domain/user-repository'

export const zodAuthUserUseCaseRequest = z.object({
  email: z.email(),
  password: z.string(),
})

export type AuthUserUseCaseRequest = z.infer<typeof zodAuthUserUseCaseRequest>

export type AuthUserUseCaseResponse = Promise<
  Result<UserDTO, InvalidCredentialsError>
>

export class AuthUserUseCase {
  private readonly userRepository: UserRepository
  private readonly passwordEncoderService: PasswordEncoderService

  constructor(
    userRepository: UserRepository,
    passwordEncoderService: PasswordEncoderService
  ) {
    this.userRepository = userRepository
    this.passwordEncoderService = passwordEncoderService
  }

  async execute(data: AuthUserUseCaseRequest): AuthUserUseCaseResponse {
    const foundUser = await this.userRepository.findByEmail(data.email)
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

    return ok(toDTO(foundUser))
  }
}
