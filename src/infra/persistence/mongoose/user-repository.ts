import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { MongooseUserMapper } from './user-mapper'
import { UserModel } from './user-model'

export class MongooseUserRepository implements UserRepository {
  private readonly model = UserModel

  public async create(user: User): Promise<void> {
    const userData = MongooseUserMapper.toPersistence(user)

    await this.model.create(userData)
  }

  public async findById(id: UserId): Promise<User | null> {
    const doc = await this.model.findOne({ username: id.username }).lean()

    return doc ? MongooseUserMapper.toDomain(doc) : null
  }
}
