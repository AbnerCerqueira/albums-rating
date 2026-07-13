import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { Email } from '@/contexts/user/domain/value-objects/email'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { Username } from '@/contexts/user/domain/value-objects/username'
import type { UserDataDomainId } from '@/contexts/user/infra/persistence/user-model'
import { UserModel } from '@/contexts/user/infra/persistence/user-model'
import { UserMapper } from './user-mapper'

export class MongooseUserRepository implements UserRepository {
  private readonly model = UserModel

  async save(user: User): Promise<User> {
    const userData = UserMapper.toPersistence(user)
    const filter = {
      'domainId.email': userData.domainId.email,
      'domainId.username': userData.domainId.username,
    }
    const updated = await this.model
      .findOneAndUpdate(filter, userData, {
        new: true,
        upsert: true,
      })
      .lean()

    return UserMapper.toDomain(updated)
  }

  async findById(id: UserId): Promise<User | null> {
    const foundUser = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundUser ? UserMapper.toDomain(foundUser) : null
  }

  async findByEmail(email: Email): Promise<User | null> {
    const doc = await this.model
      .findOne({ 'domainId.email': email.value })
      .lean()

    return doc ? UserMapper.toDomain(doc) : null
  }

  async findByUsername(username: Username): Promise<User | null> {
    const doc = await this.model
      .findOne({ 'domainId.username': username.value })
      .lean()

    return doc ? UserMapper.toDomain(doc) : null
  }

  private getFlattenObjOfDomainId(id: UserId): UserDataDomainId {
    return {
      email: id.email.value,
      username: id.username.value,
    }
  }
}
