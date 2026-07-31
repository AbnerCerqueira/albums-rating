const BASE_URL = '/api/rating'

const GET = {
  POPULAR_ALBUMS: `${BASE_URL}/popular`,
  REVIEWS_BY_ALBUM: (publicId: string) => `${BASE_URL}/album/${publicId}`,
  REVIEWS_BY_USER: (username: string) => `${BASE_URL}/user/${username}`,
  TOP_ALBUMS: `${BASE_URL}/top`,
}

const DELETE = {
  REVIEW: (publicId: string) => `${BASE_URL}/review/${publicId}`,
}

const PATCH = {
  EDIT_REVIEW: (publicId: string) => `${BASE_URL}/review/${publicId}`,
}

const POST = {
  CREATE_REVIEW: `${BASE_URL}/review`,
}

export const RatingRoutes = { DELETE, GET, PATCH, POST }
