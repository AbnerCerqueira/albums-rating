import { CreateUserUseCase } from '@/contexts/user/application/use-cases/create-user-use-case'
import { bcryptPasswordEncoder } from '@/infra/lib/hash/bcrypt'
import { mongooseUserRepository } from './repositories'

export const createUserUseCase = new CreateUserUseCase(
  mongooseUserRepository,
  bcryptPasswordEncoder
)
