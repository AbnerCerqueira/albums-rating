import type { User } from './user'
import type { Email } from './value-objects/email'

export interface UserRepository {
  create(user: User): Promise<User>
  findByEmail(email: Email): Promise<User | null>
}
