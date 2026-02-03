const BASE_URL = '/api/user'

const POST = {
  CREATE_USER: BASE_URL,
}

const GET = {
  LOGIN: `${BASE_URL}/login`,
}

export const UserRoutes = { GET, POST }
