import { DomainService } from '../../domain/services/is-unique-user'
import { userRepository } from './repositories'

export const isUniqueUserService = new DomainService.IsUniqueUser(
  userRepository
)
