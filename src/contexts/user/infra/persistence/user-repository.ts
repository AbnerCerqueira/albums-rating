import type { User } from '@/contexts/user/domain/user'
import type { UserRepository } from '@/contexts/user/domain/user-repository'
import type { UserId } from '@/contexts/user/domain/value-objects/user-id'
import type { UserDataDomainId } from '@/contexts/user/infra/persistence/user-model'
import { UserModel } from '@/contexts/user/infra/persistence/user-model'
import { toDomain, toPersistence } from './user-mapper'

export class MongooseUserRepository implements UserRepository {
  private readonly model = UserModel

  async save(user: User): Promise<User> {
    const userData = toPersistence(user)
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

    return toDomain(updated)
  }

  async findById(id: UserId): Promise<User | null> {
    const foundUser = await this.model
      .findOne(this.getFlattenObjOfDomainId(id))
      .lean()

    return foundUser ? toDomain(foundUser) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ 'domainId.email': email }).lean()

    return doc ? toDomain(doc) : null
  }

  private getFlattenObjOfDomainId(id: UserId): UserDataDomainId {
    return {
      email: id.email,
      username: id.username,
    }
  }
}
