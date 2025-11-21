import { AuthUseUseCase } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { CreateUserUseCase } from '@/contexts/user/application/use-cases/create-user-use-case'
import { bcryptPasswordEncoder } from '@/infra/lib/hash/bcrypt'
import { isUniqueUserService } from './domain-services'
import { mongooseUserRepository } from './repositories'

export const createUserUseCase = new CreateUserUseCase(
  isUniqueUserService,
  bcryptPasswordEncoder,
  mongooseUserRepository
)

export const authUserUseCase = new AuthUseUseCase(
  mongooseUserRepository,
  bcryptPasswordEncoder
)
