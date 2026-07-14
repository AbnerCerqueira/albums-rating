import type {
  EmptyValueError,
  InvalidFormatError,
} from '@/contexts/!common/errors'
import { ok, type Result } from '@/contexts/!common/result'
import { ValueObject } from '@/contexts/!common/value-object'

export type UserIdProps = {
  email: string
  username: string
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export class UserId extends ValueObject<UserIdProps> {
  static create(
    props: UserIdProps
  ): Result<UserId, EmptyValueError | InvalidFormatError> {
    const { email, username } = props

    const normalizedEmail = ValueObject.requireNonEmptyNormalized(
      email,
      'Email',
      'lower'
    )
    if (!normalizedEmail.ok) {
      return normalizedEmail
    }
    const isValid = ValueObject.requireMatchesRegex(
      normalizedEmail.value,
      EMAIL_REGEX,
      'Email',
      'email@email.com'
    )
    if (!isValid.ok) {
      return isValid
    }
    const normalizedUsername = ValueObject.requireNonEmpty(username, 'Username')
    if (!normalizedUsername.ok) {
      return normalizedUsername
    }

    return ok(
      new UserId({
        email: normalizedEmail.value,
        username: normalizedUsername.value,
      })
    )
  }

  static unsafeCreate(props: UserIdProps): UserId {
    return new UserId(props)
  }

  get value(): UserIdProps {
    return this._value
  }

  get username(): string {
    return this._value.username
  }

  get email(): string {
    return this._value.email
  }
}
