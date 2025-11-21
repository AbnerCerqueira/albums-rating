import { PublicId } from '@/contexts/common/public-id'
import { asyncTryCatch } from '@/contexts/common/try-catch-wrapper'
import { mongooseUserRepository } from '@/infra/!ioc/user/repositories'
import { UserFactory } from '../../factories/user-factory'

describe('UserRepository', () => {
  it('unique constraints', async () => {
    const [user] = UserFactory.generate(1, new PublicId())

    await mongooseUserRepository.create(user)
    const { exception } = await asyncTryCatch(
      mongooseUserRepository.create(user)
    )

    expect(exception).not.toBeNull()
  })

  it('create', async () => {
    const [user] = UserFactory.generate()

    const newUser = await mongooseUserRepository.create(user)

    expect(newUser).toMatchObject(user)
  })

  it('findByEmail', async () => {
    const [user] = UserFactory.generate()

    await mongooseUserRepository.create(user)
    const foundUser = await mongooseUserRepository.findByEmail(user.props.email)

    expect(foundUser).toMatchObject(user)
  })
})
