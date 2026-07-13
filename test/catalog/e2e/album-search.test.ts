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

    test('searches by genre', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?genre=${encodeURIComponent(payload.genre)}`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      expect(body.albums[0].genre).toBe(payload.genre)
    })

    test('searches by format', async () => {
      const { token } = await createUserAndLogin()
      await createAlbumViaHttp(token, { format: 'LP' })

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?format=LP`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
      expect(body.albums[0].format).toBe('LP')
    })

    test('searches with multiple params', async () => {
      const { token } = await createUserAndLogin()
      const { payload } = await createAlbumViaHttp(token)

      const response = await app.inject({
        method: 'GET',
        url: `${CatalogRoutes.GET.SEARCH}?title=${encodeURIComponent(payload.title)}&artist=${encodeURIComponent(payload.artist)}&format=EP&combineWith=or`,
      })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.albums.length).toBeGreaterThanOrEqual(1)
    })
  })
})
