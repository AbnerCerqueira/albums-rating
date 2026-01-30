import { faker } from '@faker-js/faker'
import type { PublicId } from '@/contexts/!common/public-id'
import { Album, type AlbumProps } from '@/contexts/catalog/domain/album'
import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Title } from '@/contexts/catalog/domain/value-objects/title'

function generate(qty = 1, publicId?: PublicId): Album[] {
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

export const AlbumFactory = { generate }
