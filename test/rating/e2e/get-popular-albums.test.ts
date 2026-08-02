import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { createAlbumViaHttp } from '../../catalog/e2e/helpers'
import { createAndLogin } from '../../user/e2e/helpers'
import {
  createReviewViaHttp,
  getPopularAlbumsViaHttp,
  refreshCharts,
  setupUserAndAlbum,
} from './helpers'

describe('Get Popular Albums', () => {
  describe('GET /api/rating/popular', () => {
    test('returns albums sorted by review count', async () => {
      const { token, albumPublicId: album1 } = await setupUserAndAlbum()
      await createReviewViaHttp(token, album1, { rating: 3 })

      const { token: token2, albumPublicId: album2 } = await setupUserAndAlbum()
      await createReviewViaHttp(token2, album2, { rating: 5 })
      await createReviewViaHttp(token2, album2, { rating: 4 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp()

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{
        albums: { reviewCount: number; publicId: string }[]
      }>()
      const ourAlbums = body.albums.filter(
        (a) => a.publicId === album1 || a.publicId === album2
      )
      expect(ourAlbums.length).toBe(2)
      expect(ourAlbums[0].reviewCount).toBeGreaterThanOrEqual(
        ourAlbums[1].reviewCount
      )
    })

    test('returns album with correct shape', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId, { rating: 4.5 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp()

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{
        albums: Record<string, unknown>[]
      }>()
      const ourAlbum = body.albums.find(
        (a) => (a as { publicId: string }).publicId === albumPublicId
      )
      expect(ourAlbum).toBeDefined()
      expect(ourAlbum).toHaveProperty('artist')
      expect(ourAlbum).toHaveProperty('title')
      expect(ourAlbum).toHaveProperty('coverUrl')
      expect(ourAlbum).toHaveProperty('publicId')
      expect(ourAlbum).toHaveProperty('averageRating')
      expect(ourAlbum).toHaveProperty('reviewCount')
      expect(ourAlbum).toHaveProperty('genres')
      expect(ourAlbum).toHaveProperty('releaseDate')
      expect(ourAlbum).toHaveProperty('format')
    })

    test('supports pagination', async () => {
      const { token, albumPublicId } = await setupUserAndAlbum()
      await createReviewViaHttp(token, albumPublicId, { rating: 4 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp({
        page: 1,
        size: 10,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{
        albums: unknown[]
        currentPage?: number
        size?: number
        total?: number
        totalPages?: number
      }>()
      expect(body.albums).toBeInstanceOf(Array)
      expect(body.currentPage).toBe(1)
      expect(body.size).toBe(10)
      expect(body.total).toBeGreaterThanOrEqual(1)
      expect(body.totalPages).toBeGreaterThanOrEqual(1)
    })

    test('supports year range filter', async () => {
      const { token } = await createAndLogin()

      const { payload: albumPayload } = await createAlbumViaHttp(token, {
        releaseDate: '2020-06-15',
      })
      const albumPublicId2020 =
        `${albumPayload.artist}-${albumPayload.title}`.toLowerCase()
      await createReviewViaHttp(token, albumPublicId2020, { rating: 4 })

      const { payload: albumPayload2 } = await createAlbumViaHttp(token, {
        releaseDate: '2021-06-15',
      })
      const albumPublicId2021 =
        `${albumPayload2.artist}-${albumPayload2.title}`.toLowerCase()
      await createReviewViaHttp(token, albumPublicId2021, { rating: 5 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp({
        from: 2020,
        to: 2020,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ albums: { releaseDate: string }[] }>()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      for (const album of body.albums) {
        expect(album.releaseDate).toContain('2020')
      }
    })

    test('supports from filter only', async () => {
      const { token } = await createAndLogin()

      const { payload: albumPayload } = await createAlbumViaHttp(token, {
        releaseDate: '2020-06-15',
      })
      const albumPublicId2020 =
        `${albumPayload.artist}-${albumPayload.title}`.toLowerCase()
      await createReviewViaHttp(token, albumPublicId2020, { rating: 4 })

      const { payload: albumPayload2 } = await createAlbumViaHttp(token, {
        releaseDate: '2021-06-15',
      })
      const albumPublicId2021 =
        `${albumPayload2.artist}-${albumPayload2.title}`.toLowerCase()
      await createReviewViaHttp(token, albumPublicId2021, { rating: 5 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp({ from: 2021 })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ albums: { releaseDate: string }[] }>()
      const found2020 = body.albums.some((a) => a.releaseDate.includes('2020'))
      const found2021 = body.albums.some((a) => a.releaseDate.includes('2021'))
      expect(found2020).toBe(false)
      expect(found2021).toBe(true)
    })

    test('supports genre filter', async () => {
      const { token } = await createAndLogin()
      const { payload: metalPayload } = await createAlbumViaHttp(token, {
        genres: ['Metal'],
      })
      const metalPublicId =
        `${metalPayload.artist}-${metalPayload.title}`.toLowerCase()
      await createReviewViaHttp(token, metalPublicId, { rating: 4 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp({ genre: 'metal' })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ albums: { genres: string[] }[] }>()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      for (const album of body.albums) {
        expect(album.genres).toContain('Metal')
      }
    })

    test('supports format filter', async () => {
      const { token } = await createAndLogin()
      const { payload: albumPayload } = await createAlbumViaHttp(token, {
        format: 'LP',
      })
      const albumPublicId =
        `${albumPayload.artist}-${albumPayload.title}`.toLowerCase()
      await createReviewViaHttp(token, albumPublicId, { rating: 4 })
      await refreshCharts()

      const { response } = await getPopularAlbumsViaHttp({ format: 'LP' })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json<{ albums: { format: string }[] }>()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      for (const album of body.albums) {
        expect(album.format).toBe('LP')
      }
    })

    test('returns 400 for invalid pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/rating/popular?page=-1&size=-1',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for invalid year range', async () => {
      const fromResponse = await app.inject({
        method: 'GET',
        url: '/api/rating/popular?from=1899',
      })
      expect(fromResponse.statusCode).toBe(HttpStatus.BAD_REQUEST)

      const toResponse = await app.inject({
        method: 'GET',
        url: '/api/rating/popular?to=1899',
      })
      expect(toResponse.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 400 for invalid format', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/rating/popular?format=INVALID',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })
  })
})
