import { AuthUseUseCase } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { CreateUserUseCase } from '@/contexts/user/application/use-cases/create-user-use-case'
import { bcryptPasswordEncoder } from '@/infra/lib/hash/bcrypt'
import { isUniqueUserService } from './domain-services'
import { userRepository } from './repositories'

export const createUserUseCase = new CreateUserUseCase(
  isUniqueUserService,
  bcryptPasswordEncoder,
  userRepository
)

export const authUserUseCase = new AuthUseUseCase(
  userRepository,
  bcryptPasswordEncoder
)
