import { PublicId } from '@/contexts/!common/public-id'
import type { ReviewId } from './value-objects/review-id'

export type ReviewProps = {
  isFavorite: boolean
  isEdited: boolean
  rating: number
  reviewedAt: Date
}

export class Review {
  public id: ReviewId

  public publicId: PublicId

  public props: ReviewProps

  public constructor(id: ReviewId, props: ReviewProps, publicId?: PublicId) {
    this.id = id
    this.props = props
    this.publicId = publicId ?? new PublicId()
  }
}
