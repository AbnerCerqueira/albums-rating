import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAlbumViaHttp, createUserAndLogin } from './helpers'
import { CatalogRoutes } from './routes'

describe('Genre Search', () => {
  describe('GET /api/catalog/search/available-genres', () => {
    test('returns genres after album creation', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genre: 'Metal' })

      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.AVAILABLE_GENRES,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.genres.length).toBeGreaterThanOrEqual(1)
      expect(body.genres).toContain('Metal')
    })

    test('filters genres by search term', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genre: 'Metal' })
      await createAlbumViaHttp(token, { genre: 'Pop' })

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.AVAILABLE_GENRES}?genre=M`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.genres).toContain('Metal')
    })

    test('returns paginated genres', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genre: 'Metal' })
      await createAlbumViaHttp(token, { genre: 'Pop' })

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.AVAILABLE_GENRES}?page=1&size=1`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.genres.length).toBe(1)
      expect(body.currentPage).toBe(1)
      expect(body.size).toBe(1)
      expect(body.total).toBeGreaterThanOrEqual(2)
      expect(body.totalPages).toBeGreaterThanOrEqual(2)
      expect(body.totalPages).toBe(
        Math.ceil((body.total as number) / (body.size as number))
      )
    })
  })
})
