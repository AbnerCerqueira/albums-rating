import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAlbumViaHttp, createUserAndLogin } from './helpers'
import { CatalogRoutes } from './routes'

describe('Genre Search', () => {
  describe('GET /api/catalog/search/available-genres', () => {
    test('returns genres after genre creation', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genres: ['Metal'] })

      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.AVAILABLE_GENRES,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.genres.length).toBeGreaterThanOrEqual(1)
      expect(body.genres.map((g: { name: string }) => g.name)).toContain(
        'Metal'
      )
    })

    test('filters genres by search term', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genres: ['Metal'] })
      await createAlbumViaHttp(token, { genres: ['Pop'] })

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.AVAILABLE_GENRES}?name=M`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.genres.map((g: { name: string }) => g.name)).toContain(
        'Metal'
      )
    })

    test('returns paginated genres', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { genres: ['Metal'] })
      await createAlbumViaHttp(token, { genres: ['Pop'] })

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
