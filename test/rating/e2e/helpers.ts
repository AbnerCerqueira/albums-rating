import { app } from '@/app'
import { createAlbumViaHttp } from '../../catalog/e2e/helpers'
import { createAndLogin } from '../../user/e2e/helpers'
import { RatingRoutes } from './routes'

export type ReviewPayload = {
  albumPublicId: string
  isFavorite?: boolean
  rating: number
  reviewText?: string | null
}

export function createReviewPayload(
  albumPublicId: string,
  overrides?: Partial<ReviewPayload>
): ReviewPayload {
  return {
    albumPublicId,
    isFavorite: overrides?.isFavorite ?? false,
    rating: overrides?.rating ?? 4.5,
    reviewText:
      'reviewText' in (overrides ?? {})
        ? overrides?.reviewText
        : 'This is a test review text.',
  }
}

export async function createReviewViaHttp(
  token: string,
  albumPublicId: string,
  overrides?: Partial<ReviewPayload>
) {
  const payload = createReviewPayload(albumPublicId, overrides)
  const response = await app.inject({
    headers: { authorization: `Bearer ${token}` },
    method: 'POST',
    payload,
    url: RatingRoutes.POST.CREATE_REVIEW,
  })
  return { payload, response }
}

export async function editReviewViaHttp(
  token: string,
  reviewPublicId: string,
  overrides?: Partial<Omit<ReviewPayload, 'albumPublicId'>>
) {
  const payload = {
    ...(overrides?.rating !== undefined && { rating: overrides.rating }),
    ...(overrides?.reviewText !== undefined && {
      reviewText: overrides.reviewText,
    }),
    ...(overrides?.isFavorite !== undefined && {
      isFavorite: overrides.isFavorite,
    }),
  }
  const response = await app.inject({
    headers: { authorization: `Bearer ${token}` },
    method: 'PATCH',
    payload,
    url: RatingRoutes.PATCH.EDIT_REVIEW(reviewPublicId),
  })
  return { payload, response }
}

export async function setupUserAndAlbum() {
  const { token, user } = await createAndLogin()
  const { response: albumResponse } = await createAlbumViaHttp(token)
  const albumPublicId = albumResponse.json<{ publicId: string }>().publicId
  return { albumPublicId, token, user }
}

export async function getReviewsByUserViaHttp(
  username: string,
  query?: { page?: number; size?: number }
) {
  const searchParams = new URLSearchParams()
  if (query?.page !== undefined) {
    searchParams.set('page', String(query.page))
  }
  if (query?.size !== undefined) {
    searchParams.set('size', String(query.size))
  }
  const qs = searchParams.toString()
  const url = `${RatingRoutes.GET.REVIEWS_BY_USER(username)}${qs ? `?${qs}` : ''}`

  const response = await app.inject({
    method: 'GET',
    url,
  })
  return { response }
}

export const createUserAndLogin = createAndLogin
