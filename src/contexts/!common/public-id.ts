import { uuidv7 } from 'uuidv7'

export class PublicId {
  private readonly id: string

  public constructor(id?: string) {
    this.id = id ?? uuidv7()
  }

  public toString(): string {
    return this.id
  }
}
