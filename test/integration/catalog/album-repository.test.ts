import { Pagination } from '@/contexts/!common/pagination'
import { albumRepository } from '@/contexts/catalog/infra/!ioc/repositories'
import { AlbumFactory } from '../../factories/album-factory'

describe('AlbumRepository', () => {
  it('should create an album', async () => {
    const [album] = AlbumFactory.generate()
    const newAlbum = await albumRepository.create(album)

    expect(newAlbum).toMatchObject(album)
  })

  it('should find album by id', async () => {
    const [album] = AlbumFactory.generate()
    await albumRepository.create(album)
    const foundAlbum = await albumRepository.findById(album.id)

    expect(foundAlbum).not.toBeNull()
  })

  it('should find albums paginated', async () => {
    const albumsQty = 2

    const albums = AlbumFactory.generate(albumsQty)
    for (const album of albums) {
      await albumRepository.create(album)
    }

    const page = 1
    const pageSize = albumsQty - 1
    const result = await albumRepository.find(
      Pagination.unsafeCreate(page, pageSize)
    )

    expect(result.length).toBe(pageSize)
  })
})
