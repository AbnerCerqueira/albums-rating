import { DomainService as DomainServiceEmail } from '../../domain/services/is-unique-email'
import { DomainService as DomainServiceUser } from '../../domain/services/is-unique-user'
import { userRepository } from './repositories'

export const isUniqueUserService = new DomainServiceUser.IsUniqueUser(
  userRepository
)
export const isUniqueEmailService = new DomainServiceEmail.IsUniqueEmail(
  userRepository
)
