import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createReviewViaHttp, refreshCharts } from '../../rating/e2e/helpers'
import { createAlbumViaHttp, createUserAndLogin } from './helpers'
import { CatalogRoutes } from './routes'

describe('Get Album By PublicId', () => {
  describe('GET /api/catalog/:publicId', () => {
    test('returns album by publicId', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const created = createResponse.json<{ publicId: string }>()

      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.ALBUM_BY_PUBLIC_ID(created.publicId),
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.publicId).toBe(created.publicId)
      expect(body).toHaveProperty('title')
      expect(body).toHaveProperty('artist')
      expect(body.reviewCount).toBe(0)
    })

    test('returns reviewCount reflecting actual reviews', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const { publicId } = createResponse.json()

      await createReviewViaHttp(token, publicId, { rating: 4.5 })
      await refreshCharts()

      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.ALBUM_BY_PUBLIC_ID(publicId),
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.reviewCount).toBe(1)
    })

    test('returns 404 for non-existent publicId', async () => {
      const response = await app.inject({
        method: 'GET',
        url: CatalogRoutes.GET.ALBUM_BY_PUBLIC_ID('nao-existe-album'),
      })

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })
  })
})
