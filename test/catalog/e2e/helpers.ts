import { randomUUID } from 'node:crypto'
import { app } from '@/app'
import { FORMATS, type Format } from '@/contexts/catalog/domain/album'
import { createAndLogin } from '../../user/e2e/helpers'
import { CatalogRoutes } from './routes'

export type AlbumPayload = {
  artist: string
  format: Format
  genres: string[]
  releaseDate: string
  title: string
}

export function createAlbumPayload(
  overrides?: Partial<AlbumPayload>
): AlbumPayload {
  const suffix = randomUUID().slice(0, 8)
  return {
    artist: overrides?.artist ?? `Artist-${suffix}`,
    format:
      overrides?.format ?? FORMATS[Math.floor(Math.random() * FORMATS.length)],
    genres: overrides?.genres ?? ['Rock'],
    releaseDate: overrides?.releaseDate ?? '2023-01-15',
    title: overrides?.title ?? `Album-${suffix}`,
  }
}

export async function createGenreViaHttp(token: string, name: string) {
  return await app.inject({
    headers: { authorization: `Bearer ${token}` },
    method: 'POST',
    payload: { name },
    url: CatalogRoutes.POST.CREATE_GENRE,
  })
}

export async function createAlbumViaHttp(
  token: string,
  overrides?: Partial<AlbumPayload>
) {
  const payload = createAlbumPayload(overrides)

  await Promise.all(
    payload.genres.map((genreName) => createGenreViaHttp(token, genreName))
  )

  const response = await app.inject({
    headers: { authorization: `Bearer ${token}` },
    method: 'POST',
    payload,
    url: CatalogRoutes.POST.CREATE_ALBUM,
  })
  return { payload, response }
}

export const createUserAndLogin = createAndLogin

export type CoverUploadOptions = {
  contentType?: string
  data?: Buffer
  filename?: string
}

export function buildCoverMultipartBody(options: CoverUploadOptions = {}): {
  body: Buffer
  boundary: string
} {
  const boundary = '----albumsRatingTestBoundary'
  const filename = options.filename ?? 'cover.jpg'
  const contentType = options.contentType ?? 'image/jpeg'
  const data = options.data ?? Buffer.from('fake-jpeg-bytes')

  const header = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="cover"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`
  )
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`)

  return { body: Buffer.concat([header, data, footer]), boundary }
}

export async function uploadCoverViaHttp(
  token: string,
  publicId: string,
  options?: CoverUploadOptions
) {
  const { body, boundary } = buildCoverMultipartBody(options)

  const response = await app.inject({
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': `multipart/form-data; boundary=${boundary}`,
    },
    method: 'PATCH',
    payload: body,
    url: CatalogRoutes.PATCH.ALBUM_COVER(publicId),
  })
  return { response }
}
