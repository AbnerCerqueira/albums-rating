import type { User } from './user'
import type { UserId } from './value-objects/user-id'

export interface UserRepository {
  create(user: User): Promise<void>
  findById(id: UserId): Promise<User | null>
}
