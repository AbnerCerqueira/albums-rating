import { AuthUserUseCase } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { CreateUserUseCase } from '@/contexts/user/application/use-cases/create-user-use-case'
import { IsUniqueEmailService } from '@/contexts/user/domain/services/is-unique-email'
import { IsUniqueUserService } from '@/contexts/user/domain/services/is-unique-user'
import { bcryptPasswordEncoder } from '@/infra/lib/hash/bcrypt'
import { MongooseUserRepository } from './persistence/user-repository'

const userRepository = new MongooseUserRepository()
const isUniqueUserService = new IsUniqueUserService(userRepository)
const isUniqueEmailService = new IsUniqueEmailService(userRepository)

export const createUserUseCase = new CreateUserUseCase(
  isUniqueEmailService,
  isUniqueUserService,
  bcryptPasswordEncoder,
  userRepository
)

export const authUserUseCase = new AuthUserUseCase(
  userRepository,
  bcryptPasswordEncoder
)
