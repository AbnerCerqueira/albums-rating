import type {
  EmptyValueError,
  InvalidFormatError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import { ValueObject } from '@/contexts/!common/value-object'

const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

export class Password extends ValueObject<string> {
  static create(
    password: string
  ): Result<Password, EmptyValueError | InvalidFormatError> {
    const normalizedPassword = ValueObject.requireNonEmpty(password, 'Password')
    if (!normalizedPassword.ok) {
      return normalizedPassword
    }

    const isValid = ValueObject.requireMatchesRegex(
      normalizedPassword.value,
      PASSWORD_REGEX,
      'Password',
      'Pelo menos 1 número\nPelo menos 1 letra maiúcula\nPelo menos 1 caractere especial\nNo mínimo 8 caracteres'
    )
    if (!isValid.ok) {
      return isValid
    }

    return ok(new Password(normalizedPassword.value))
  }

  static unsafeCreate(password: string): Password {
    return new Password(password)
  }

  get value(): string {
    return this._value
  }
}
