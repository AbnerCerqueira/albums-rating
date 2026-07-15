import { randomUUID } from 'node:crypto'
import { app } from '@/app'
import { FORMATS, type Format } from '@/contexts/catalog/domain/album'
import { createAndLogin } from '../../user/e2e/helpers'
import { CatalogRoutes } from './routes'

export type AlbumPayload = {
  artist: string
  format: Format
  genre: string
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
    genre: overrides?.genre ?? 'Rock',
    releaseDate: overrides?.releaseDate ?? '2023-01-15',
    title: overrides?.title ?? `Album-${suffix}`,
  }
}

export async function createAlbumViaHttp(
  token: string,
  overrides?: Partial<AlbumPayload>
) {
  const payload = createAlbumPayload(overrides)
  const response = await app.inject({
    headers: { authorization: `Bearer ${token}` },
    method: 'POST',
    payload,
    url: CatalogRoutes.POST.CREATE_ALBUM,
  })
  return { payload, response }
}

export const createUserAndLogin = createAndLogin
