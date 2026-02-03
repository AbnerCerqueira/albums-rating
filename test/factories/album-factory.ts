import { faker } from '@faker-js/faker'
import type { PublicId } from '@/contexts/!common/public-id'
import type { CreateAlbumUserCaseRequest } from '@/contexts/catalog/application/create-albums-use-case'
import { Album, type AlbumProps } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Title } from '@/contexts/catalog/domain/value-objects/title'

function createUnit(qty = 1, publicId?: PublicId): Album[] {
  return Array.from({ length: qty }).map(() => {
    const albumId = new AlbumId(
      Title.unsafeCreate(faker.music.album()),
      faker.music.artist()
    )
    const props: AlbumProps = {
      format: 'LP',
      genre: faker.music.genre(),
      releaseDate: new Date(),
    }

    return new Album(albumId, props, publicId)
  })
}

const UNIT_OR_INTEGRATION = {
  create: createUnit,
}

function createPayload(qty = 1): CreateAlbumUserCaseRequest[] {
  return Array.from({ length: qty }).map(() => {
    const title = faker.music.album()
    const artist = faker.music.artist()
    const format = 'LP'
    const genre = faker.music.genre()
    const releaseDate = new Date().toISOString().split('T')[0]

    return {
      title,
      artist,
      format,
      genre,
      releaseDate,
    }
  })
}

const E2E = {
  createPayload,
}

export const AlbumFactory = { UNIT_OR_INTEGRATION, E2E }
