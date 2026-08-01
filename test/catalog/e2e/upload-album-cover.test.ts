import { app } from '@/app'
import { env } from '@/infra/config/envs'
import { HttpStatus } from '@/infra/http/http-status'
import {
  buildCoverMultipartBody,
  createAlbumViaHttp,
  createUserAndLogin,
  uploadCoverViaHttp,
} from './helpers'
import { CatalogRoutes } from './routes'

describe('Upload Album Cover', () => {
  describe('PATCH /api/catalog/:publicId/cover', () => {
    test('uploads a cover and returns 200 with updated dto', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const { publicId } = createResponse.json()

      const data = Buffer.from('fake-jpeg-bytes')
      const { response } = await uploadCoverViaHttp(token, publicId, { data })

      expect(response.statusCode).toBe(HttpStatus.OK)
      const body = response.json()
      expect(body.coverUrl).toMatch(
        new RegExp(`^${env.PUBLIC_BASE_URL}/covers/${publicId}-[^/]+\\.jpg$`)
      )
    })

    test('persists the cover and serves the file statically', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const { publicId } = createResponse.json()

      const data = Buffer.from('fake-jpeg-bytes')
      const { response } = await uploadCoverViaHttp(token, publicId, { data })
      const { coverUrl } = response.json()

      const getResponse = await app.inject({
        method: 'GET',
        url: new URL(coverUrl).pathname,
      })
      expect(getResponse.statusCode).toBe(HttpStatus.OK)
      expect(getResponse.rawPayload.equals(data)).toBeTruthy()
    })

    test('deletes the previous cover when a new one is uploaded', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const { publicId } = createResponse.json()

      const { response: firstResponse } = await uploadCoverViaHttp(
        token,
        publicId,
        { data: Buffer.from('first-cover-bytes') }
      )
      const firstCoverUrl = firstResponse.json().coverUrl

      const { response: secondResponse } = await uploadCoverViaHttp(
        token,
        publicId,
        { data: Buffer.from('second-cover-bytes') }
      )
      const secondCoverUrl = secondResponse.json().coverUrl

      expect(secondCoverUrl).not.toBe(firstCoverUrl)

      const oldCoverResponse = await app.inject({
        method: 'GET',
        url: firstCoverUrl,
      })
      expect(oldCoverResponse.statusCode).toBe(HttpStatus.NOT_FOUND)

      const newCoverResponse = await app.inject({
        method: 'GET',
        url: secondCoverUrl,
      })
      expect(newCoverResponse.statusCode).toBe(HttpStatus.OK)
      expect(
        newCoverResponse.rawPayload.equals(Buffer.from('second-cover-bytes'))
      ).toBeTruthy()
    })

    test('returns 404 for a non-existent album', async () => {
      const { token } = await createUserAndLogin()
      const { response } = await uploadCoverViaHttp(token, 'nonexistent-album')

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    test('returns 400 for an invalid image type', async () => {
      const { token } = await createUserAndLogin()
      const { response: createResponse } = await createAlbumViaHttp(token)
      const { publicId } = createResponse.json()

      const { response } = await uploadCoverViaHttp(token, publicId, {
        contentType: 'application/pdf',
        filename: 'cover.pdf',
      })

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    test('returns 401 without auth token', async () => {
      const { body, boundary } = buildCoverMultipartBody()
      const response = await app.inject({
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        method: 'PATCH',
        payload: body,
        url: CatalogRoutes.PATCH.ALBUM_COVER('any-album'),
      })

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
    })
  })
})

describe('Album cover in DTO', () => {
  test('created album uses the default cover url', async () => {
    const { token } = await createUserAndLogin()
    const { response } = await createAlbumViaHttp(token)

    expect(response.statusCode).toBe(HttpStatus.CREATED)
    const body = response.json()
    expect(body.coverUrl).toBe(env.DEFAULT_COVER_URL)
  })

  test('serves the default cover image statically', async () => {
    const response = await app.inject({
      method: 'GET',
      url: new URL(env.DEFAULT_COVER_URL).pathname,
    })

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.headers['content-type']).toBe('image/png')
  })

  test('returns the coverUrl on GET by publicId', async () => {
    const { token } = await createUserAndLogin()
    const { response: createResponse } = await createAlbumViaHttp(token)
    const { publicId } = createResponse.json()

    const response = await app.inject({
      method: 'GET',
      url: CatalogRoutes.GET.ALBUM_BY_PUBLIC_ID(publicId),
    })

    expect(response.statusCode).toBe(HttpStatus.OK)
    expect(response.json()).toHaveProperty('coverUrl')
  })
})
