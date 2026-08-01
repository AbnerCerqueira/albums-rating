import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAlbumViaHttp, createUserAndLogin } from './helpers'
import { CatalogRoutes } from './routes'

describe('Album Search', () => {
  describe('GET /api/catalog/search', () => {
    test('returns empty results when no matches', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?title=nonexistent`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums).toEqual([])
    })

    test('searches by title', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?title=${encodeURIComponent(payload.title)}`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      expect(body.albums[0].title).toBe(payload.title)
      expect(body.albums[0]).toHaveProperty('reviewCount')
      expect(body.albums[0]).toHaveProperty('averageRating')
    })

    test('searches by artist', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?artist=${encodeURIComponent(payload.artist)}`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      expect(body.albums[0].artist).toBe(payload.artist)
    })

    test('searches with multiple params', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?title=${encodeURIComponent(payload.title)}&artist=${encodeURIComponent(payload.artist)}`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
    })
  })
})
