import { randomUUID } from 'node:crypto'
import { ValueObject } from './value-object'

export class PublicId extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }

  static create(value?: string): PublicId {
    if (value) {
      return new PublicId(value.trim().toLowerCase())
    }
    return new PublicId(randomUUID())
  }

  get value(): string {
    return this._value
  }
}
