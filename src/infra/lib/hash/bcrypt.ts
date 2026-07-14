import bcrypt from 'bcryptjs'
import type { PasswordEncoderService } from '@/contexts/user/application/services/password-encoder-service'
import { env } from '@/infra/config/envs'

export class BcryptPasswordEncoder implements PasswordEncoderService {
  private readonly salt = env.PROFILE === 'test' ? 0 : 12

  public encode(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt)
  }

  public match(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

export const bcryptPasswordEncoder = new BcryptPasswordEncoder()
