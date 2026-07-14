import { AuthUserUseCase } from '@/contexts/user/application/use-cases/auth-user-use-case'
import { CreateUserUseCase } from '@/contexts/user/application/use-cases/create-user-use-case'
import { DomainUserServices } from '@/contexts/user/domain/services/domain-user-services'
import { bcryptPasswordEncoder } from '@/infra/lib/hash/bcrypt'
import { MongooseUserRepository } from './persistence/user-repository'

const userRepository = new MongooseUserRepository()
const domainUserServices = new DomainUserServices(userRepository)

export const createUserUseCase = new CreateUserUseCase(
  domainUserServices,
  bcryptPasswordEncoder,
  userRepository
)

export const authUserUseCase = new AuthUserUseCase(
  userRepository,
  bcryptPasswordEncoder
)
