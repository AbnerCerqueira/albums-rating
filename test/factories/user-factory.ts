import { faker } from '@faker-js/faker'
import type { PublicId } from '@/contexts/common/public-id'
import { User } from '@/contexts/user/domain/user'
import { Email } from '@/contexts/user/domain/value-objects/email'
import { Password } from '@/contexts/user/domain/value-objects/password'
import { Username } from '@/contexts/user/domain/value-objects/username'

function generate(qty = 1, id?: PublicId): User[] {
  return Array.from({ length: qty }).map(() => {
    const username = Username.unsafeCreate(faker.person.firstName())
    const email = Email.unsafeCreate(faker.internet.email())
    const password = Password.unsafeCreate('password123')
    return new User({ username, email, password }, id)
  })
}

export const UserFactory = { generate }
