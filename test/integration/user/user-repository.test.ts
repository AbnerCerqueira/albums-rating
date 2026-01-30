import { PublicId } from '@/contexts/common/public-id'
import { asyncTryCatch } from '@/contexts/common/try-catch-wrapper'
import { mongooseUserRepository } from '@/infra/!ioc/user/repositories'
import { UserFactory } from '../../factories/user-factory'

describe('UserRepository', () => {
  it('verify unique fields', async () => {
    const [user] = UserFactory.generate(1, new PublicId())

    await mongooseUserRepository.create(user)
    const { exception } = await asyncTryCatch(
      mongooseUserRepository.create(user)
    )

    expect(exception).not.toBeNull()
  })

  it('should create', async () => {
    const [user] = UserFactory.generate()

    const newUser = await mongooseUserRepository.create(user)

    expect(newUser).toMatchObject(user)
  })

  it('should find by id', async () => {
    const [user] = UserFactory.generate()

    await mongooseUserRepository.create(user)
    const foundUser = await mongooseUserRepository.findById(user.id)

    expect(foundUser).toMatchObject(user)
  })
})
