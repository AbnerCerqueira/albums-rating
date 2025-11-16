import { User } from '@/contexts/user/domain/user'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { UserId } from '@/contexts/user/domain/value-objects/user-id'
import { mongooseUserRepository } from '@/infra/!ioc/user/repositories'

describe('UserRepository', () => {
  it('should create and find user by id', async () => {
    const user = new User(
      UserId.unsafeCreate('validUsername'),
      Password.unsafeCreate('validPassword')
    )

    await mongooseUserRepository.create(user)

    const newUser = await mongooseUserRepository.findById(user.id)

    expect(newUser).toMatchObject(user)
  })
})
