import { albumRepository } from '@/infra/!ioc/catalog/repositories'
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
})
