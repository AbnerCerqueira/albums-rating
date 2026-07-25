import type { Model, PopulateOptions, Types } from 'mongoose'
import type { AlbumData } from '@/contexts/catalog/infra/persistence/album-model'
import type { ReviewId } from '@/contexts/rating/domain/value-objects/review-id'
import type { UserData } from '@/contexts/user/infra/persistence/user-model'

export const POPULATE_OPTIONS: (PopulateOptions | string)[] = [
  { path: 'albumId', populate: { path: 'genres' } },
  'userId',
]

export async function resolveObjectIds(
  userModel: Model<UserData>,
  albumModel: Model<AlbumData>,
  reviewId: ReviewId
): Promise<{ userId: Types.ObjectId; albumId: Types.ObjectId } | null> {
  const [user, album] = await Promise.all([
    userModel
      .findOne({
        email: reviewId.userId.email.value,
        username: reviewId.userId.username.value,
      })
      .lean(),
    albumModel
      .findOne({
        artist: reviewId.albumId.artist.value,
        title: reviewId.albumId.title.value,
      })
      .lean(),
  ])

  if (!(user && album)) {
    return null
  }

  const userId = user._id
  if (!userId) {
    throw new Error('User _id is missing')
  }

  const albumId = album._id
  if (!albumId) {
    throw new Error('Album _id is missing')
  }

  return { albumId, userId }
}
