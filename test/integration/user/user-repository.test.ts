import { PublicId } from '@/contexts/!common/public-id'
import { asyncTryCatch } from '@/contexts/!common/try-catch-wrapper'
import { userRepository } from '@/contexts/user/infra/!ioc/repositories'
import { UserFactory } from '../../factories/user-factory'

describe('UserRepository', () => {
  it('verify unique fields', async () => {
    const [user] = UserFactory.UNIT_OR_INTEGRATION.create(1, new PublicId())

    await userRepository.create(user)
    const { exception } = await asyncTryCatch(userRepository.create(user))

    expect(exception).not.toBeNull()
  })

  it('should create', async () => {
    const [user] = UserFactory.UNIT_OR_INTEGRATION.create()

    const newUser = await userRepository.create(user)

    expect(newUser).toMatchObject(user)
  })

  it('should find by id', async () => {
    const [user] = UserFactory.UNIT_OR_INTEGRATION.create()

    await userRepository.create(user)
    const foundUser = await userRepository.findById(user.id)

    expect(foundUser).toMatchObject(user)
  })
})
