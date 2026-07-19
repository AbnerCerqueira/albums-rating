import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAlbumViaHttp, createUserAndLogin } from './helpers'
import { CatalogRoutes } from './routes'

describe('Get Albums', () => {
  describe('GET /api/catalog', () => {
    test('returns albums after creation', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.ALBUMS,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      expect(body.albums[0]).toHaveProperty('title')
      expect(body.albums[0]).toHaveProperty('artist')
    })

    test('returns paginated results', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token)
      await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.ALBUMS}?page=1&size=1`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBe(1)
      expect(body.currentPage).toBe(1)
      expect(body.size).toBe(1)
      expect(body.total).toBeGreaterThanOrEqual(2)
      expect(body.totalPages).toBeGreaterThanOrEqual(2)
      expect(body.totalPages).toBe(
        Math.ceil((body.total as number) / (body.size as number))
      )
    })

    test('returns 400 for invalid pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.ALBUMS}?page=-1&size=-1`,
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
