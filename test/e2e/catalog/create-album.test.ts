import { app } from '@/app'
import { HttpStatus } from '@/infra/http/http-status'
import { AlbumFactory } from '../../factories/album-factory'
import { UserFactory } from '../../factories/user-factory'
import { CatalogRoutes } from './routes'

let token = ''

describe('POST /api/catalog', () => {
  beforeAll(async () => {
    const result = await UserFactory.E2E.createAndLogin()
    token = result.token
  })

  it('should return 401 if token is missing', async () => {
    const [payload] = AlbumFactory.E2E.createPayload()

    const res = await app.inject({
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    expect(res.json()).toMatchObject({ message: 'Token inválido ou ausente' })
  })

  it('should return 401 if token is invalid', async () => {
    const [payload] = AlbumFactory.E2E.createPayload()

    const res = await app.inject({
      headers: { authorization: 'Bearer token-invalido' },
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED)
  })

  it('should return 400 if invalid arguments', async () => {
    const [payload] = AlbumFactory.E2E.createPayload()

    payload.title = payload.title.repeat(500)
    const res = await app.inject({
      headers: { authorization: `Bearer ${token}` },
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
  })

  it('should return 409 if duplicate album', async () => {
    const [payload] = AlbumFactory.E2E.createPayload()

    await app.inject({
      headers: { authorization: `Bearer ${token}` },
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    const res = await app.inject({
      headers: { authorization: `Bearer ${token}` },
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    expect(res.statusCode).toBe(HttpStatus.CONFLICT)
  })

  it('should create an album and return 200', async () => {
    const [payload] = AlbumFactory.E2E.createPayload()

    const res = await app.inject({
      headers: { authorization: `Bearer ${token}` },
      method: 'POST',
      payload,
      url: CatalogRoutes.POST.CREATE_ALBUM,
    })

    expect(res.statusCode).toBe(HttpStatus.OK)
    const body = res.json()
    expect(body).toMatchObject({
      artist: payload.artist,
      format: payload.format,
      genre: payload.genre,
      releaseDate: payload.releaseDate,
      title: payload.title,
    })
    expect(body).toHaveProperty('publicId')
    expect(typeof body.publicId).toBe('string')
  })
})
