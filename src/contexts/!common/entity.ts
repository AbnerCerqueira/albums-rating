import type { PublicId } from './public-id'

export type Timestamps = {
  createdAt: Date
  updatedAt: Date
}

export abstract class Entity<Props> {
  protected props: Props & { publicId: PublicId } & Timestamps

  protected constructor(
    props: Props,
    publicId: PublicId,
    timestamps: Timestamps
  ) {
    this.props = {
      ...props,
      publicId,
      ...timestamps,
    }
  }

  get publicId(): PublicId {
    return this.props.publicId
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt.getTime())
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt.getTime())
  }

  abstract equals(other: Entity<Props>): boolean
}
