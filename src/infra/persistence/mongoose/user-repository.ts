import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { Email } from '@/contexts/user/domain/value-objects/email'
import { MongooseUserMapper } from './user-mapper'
import { UserModel } from './user-model'

export class MongooseUserRepository implements UserRepository {
  private readonly model = UserModel

  public async create(user: User): Promise<User> {
    const userData = MongooseUserMapper.toPersistence(user)

    const newUser = (await this.model.create(userData)).toObject()

    return MongooseUserMapper.toDomain(newUser)
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const doc = await this.model.findOne({ email: email.value }).lean()

    return doc ? MongooseUserMapper.toDomain(doc) : null
  }
}
