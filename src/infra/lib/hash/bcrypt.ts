import bcrypt from 'bcryptjs'
import type { PasswordEncoder } from '@/contexts/user/application/password-encoder'
import { env } from '@/infra/config/envs'

export class BcryptPasswordEncoder implements PasswordEncoder {
  private readonly salt = env.PROFILE !== 'test' ? 12 : 1

  public encode(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt)
  }

  public match(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

export const bcryptPasswordEncoder = new BcryptPasswordEncoder()
