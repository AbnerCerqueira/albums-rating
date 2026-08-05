import { uuidv7 } from 'uuidv7'

export class PublicId {
  private constructor(readonly value: string) {}

  static create(value?: string): PublicId {
    const normalized = value?.trim().toLowerCase()
    if (normalized) {
      return new PublicId(normalized)
    }
    return new PublicId(uuidv7())
  }

  static unsafe(value: string): PublicId {
    return new PublicId(value)
  }

  equals(other: PublicId): boolean {
    return this.value === other.value
  }
}
