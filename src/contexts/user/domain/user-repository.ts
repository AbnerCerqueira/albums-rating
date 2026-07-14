import type { User } from '@/contexts/user/domain/user'
import type { Email } from '@/contexts/user/domain/value-objects/email'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Username } from '@/contexts/user/domain/value-objects/username'

export interface UserRepository {
  findByEmail: (email: Email) => Promise<User | null>
  findById: (id: UserId) => Promise<User | null>
  findByUsername: (username: Username) => Promise<User | null>
  save: (user: User) => Promise<User>
}
