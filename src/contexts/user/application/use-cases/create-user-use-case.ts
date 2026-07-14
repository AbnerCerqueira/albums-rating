import z from 'zod'
import type {
  ConflictError,
  InvalidArgumentError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import type { PasswordEncoderService } from '@/contexts/user/application/services/password-encoder-service'
import {
  type UserDTO,
  UserDTOMapper,
} from '@/contexts/user/application/user-dto'
import type { DomainUserServices } from '@/contexts/user/domain/services/domain-user-services'
import { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { Username } from '@/contexts/user/domain/value-objects/username'

export const zodCreateUserUseCaseRequest = z.object({
  email: z.email(),
  password: z.string(),
  username: z.string(),
})

export type CreateUserUseCaseRequest = z.infer<
  typeof zodCreateUserUseCaseRequest
>

export type CreateUserUseCaseResponse = Promise<
  Result<UserDTO, InvalidArgumentError | ConflictError>
>

export class CreateUserUseCase {
  constructor(
    private readonly domainServices: DomainUserServices,
    private readonly passwordEncoder: PasswordEncoderService,
    private readonly repository: UserRepository
  ) {}

  async execute(data: CreateUserUseCaseRequest): CreateUserUseCaseResponse {
    const email = Email.create(data.email)
    if (!email.ok) {
      return email
    }

    const username = Username.create(data.username)
    if (!username.ok) {
      return username
    }

    const isEmailUnique = await this.domainServices.isEmailUnique(email.value)
    if (!isEmailUnique.ok) {
      return isEmailUnique
    }

    const isUsernameUnique = await this.domainServices.isUsernameUnique(
      username.value
    )
    if (!isUsernameUnique.ok) {
      return isUsernameUnique
    }

    const id = UserId.create({ email: email.value, username: username.value })

    const isUserUnique = await this.domainServices.isUserUnique(id)
    if (!isUserUnique.ok) {
      return isUserUnique
    }

    const plainPassword = Password.create(data.password)
    if (!plainPassword.ok) {
      return plainPassword
    }

    const hashedPassword = await this.passwordEncoder.encode(
      plainPassword.value.value
    )

    const user = User.create({
      id,
      password: Password.fromHash(hashedPassword),
    })

    const newUser = await this.repository.save(user)
    return ok(UserDTOMapper.toDTO(newUser))
  }
}
