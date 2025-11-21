import { DomainService } from '@/contexts/user/domain/services/is-unique-user'
import { mongooseUserRepository } from './repositories'

export const isUniqueUserService = new DomainService.IsUniqueUser(
  mongooseUserRepository
)
