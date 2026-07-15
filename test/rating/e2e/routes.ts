const BASE_URL = '/api/rating'

const GET = {
  REVIEWS_BY_USER: (username: string) => `${BASE_URL}/user/${username}`,
}

const PATCH = {
  EDIT_REVIEW: (publicId: string) => `${BASE_URL}/review/${publicId}`,
}

const POST = {
  CREATE_REVIEW: `${BASE_URL}/review`,
}

export const RatingRoutes = { GET, PATCH, POST }
