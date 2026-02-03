import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { Email } from '@/contexts/user/domain/value-objects/email'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { MongooseUserMapper } from './user-mapper'
import { type UserDataDomainId, UserModel } from './user-model'

export class MongooseUserRepository implements UserRepository {
  private readonly model = UserModel

  public async create(user: User): Promise<User> {
    const userData = MongooseUserMapper.toPersistence(user)

    const newUser = (await this.model.create(userData)).toObject()

    return MongooseUserMapper.toDomain(newUser)
  }

  public async findById(id: UserId): Promise<User | null> {
    const foundUser = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundUser ? MongooseUserMapper.toDomain(foundUser) : null
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const doc = await this.model
      .findOne({ 'domainId.email': email.value })
      .lean()

    return doc ? MongooseUserMapper.toDomain(doc) : null
  }

  private getFlattenObjOfDomainId(id: UserId) {
    const domainId: UserDataDomainId = {
      email: id.email.value,
      username: id.username.value,
    }

    return {
      'domainId.email': domainId.email,
      'domainId.username': domainId.username,
    }
  }
}
