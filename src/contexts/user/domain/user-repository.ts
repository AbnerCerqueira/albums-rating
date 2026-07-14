import type { User } from '@/contexts/user/domain/user'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'

export interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: UserId) => Promise<User | null>
  save: (user: User) => Promise<User>
}
