import { InvalidArgumentError } from '@/contexts/!common/errors'
import { err, ok, type Result } from '@/contexts/!common/result'

const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

export class Password {
  private constructor(readonly value: string) {}

  static create(password: string): Result<Password, InvalidArgumentError> {
    const trimmed = password.trim()
    if (!trimmed) {
      return err(new InvalidArgumentError('Password não pode ser vazio'))
    }
    if (!PASSWORD_REGEX.test(trimmed)) {
      return err(
        new InvalidArgumentError(
          'Senha formato inválido. Esperado: Pelo menos 1 número\nPelo menos 1 letra maiúcula\nPelo menos 1 caractere especial\nNo mínimo 8 caracteres'
        )
      )
    }
    return ok(new Password(trimmed))
  }

  static unsafe(password: string): Password {
    return new Password(password.trim())
  }

  static fromHash(hash: string): Password {
    return new Password(hash)
  }

  equals(other: Password): boolean {
    return this.value === other.value
  }
}
