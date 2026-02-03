import type { User } from './user'
import type { Email } from './value-objects/email'
import type { UserId } from './value-objects/user-id'

export interface UserRepository {
  create(user: User): Promise<User>
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
}
