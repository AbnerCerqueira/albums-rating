import z from 'zod'
import type {
  ConflictError,
  EmptyValueError,
  InvalidFormatError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import type { PasswordEncoderService } from '@/contexts/user/application/services/password-encoder-service'
import { toDTO, type UserDTO } from '@/contexts/user/application/user-dto'
import type { IsUniqueEmailService } from '@/contexts/user/domain/services/is-unique-email'
import type { IsUniqueUserService } from '@/contexts/user/domain/services/is-unique-user'
import { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'

export const zodCreateUserUseCaseRequest = z.object({
  email: z.email(),
  password: z.string(),
  username: z.string(),
})

export type CreateUserUseCaseRequest = z.infer<
  typeof zodCreateUserUseCaseRequest
>

export type CreateUserUseCaseResponse = Promise<
  Result<UserDTO, EmptyValueError | InvalidFormatError | ConflictError>
>

export class CreateUserUseCase {
  private readonly isUniqueEmailService: IsUniqueEmailService
  private readonly isUniqueUserService: IsUniqueUserService
  private readonly passwordEncoder: PasswordEncoderService
  private readonly repository: UserRepository

  constructor(
    isUniqueEmailService: IsUniqueEmailService,
    isUniqueUserService: IsUniqueUserService,
    passwordEncoder: PasswordEncoderService,
    repository: UserRepository
  ) {
    this.isUniqueEmailService = isUniqueEmailService
    this.isUniqueUserService = isUniqueUserService
    this.passwordEncoder = passwordEncoder
    this.repository = repository
  }

  async execute(data: CreateUserUseCaseRequest): CreateUserUseCaseResponse {
    const isUniqueEmail = await this.isUniqueEmailService.execute(data.email)
    if (!isUniqueEmail.ok) {
      return isUniqueEmail
    }

    const id = UserId.create({ email: data.email, username: data.username })
    if (!id.ok) {
      return id
    }

    const isUnique = await this.isUniqueUserService.execute(id.value)
    if (!isUnique.ok) {
      return isUnique
    }

    const plainPassword = Password.create(data.password)
    if (!plainPassword.ok) {
      return plainPassword
    }

    const hashedPassword = await this.passwordEncoder.encode(
      plainPassword.value.value
    )

    const user = User.create({
      id: id.value,
      password: Password.unsafeCreate(hashedPassword),
    })

    const newUser = await this.repository.save(user)
    return ok(toDTO(newUser))
  }
}
