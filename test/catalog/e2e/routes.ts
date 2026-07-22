const BASE_URL = '/api/catalog'

const POST = {
  CREATE_ALBUM: BASE_URL,
}

const GET = {
  ALBUM_BY_PUBLIC_ID: (publicId: string) =>
    `${BASE_URL}/${encodeURIComponent(publicId)}`,
  ALBUMS: BASE_URL,
  AVAILABLE_GENRES: `${BASE_URL}/search/available-genres`,
  SEARCH: `${BASE_URL}/search`,
}

export const CatalogRoutes = { GET, POST }
