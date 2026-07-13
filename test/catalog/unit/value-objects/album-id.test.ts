import { AlbumId } from '@/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '@/contexts/catalog/domain/value-objects/artist'
import { Title } from '@/contexts/catalog/domain/value-objects/title'
import { ARTIST, TITLE } from '../fixtures'

describe('AlbumId', () => {
  describe('create', () => {
    test('creates with valid title and artist', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id = AlbumId.create({ artist, title })
      expect(id.title.value).toBe(TITLE)
      expect(id.artist.value).toBe(ARTIST)
    })
  })

  describe('equals', () => {
    test('returns true for same title and artist', () => {
      const title = Title.unsafe(TITLE)
      const artist = Artist.unsafe(ARTIST)
      const id1 = AlbumId.create({ artist, title })
      const id2 = AlbumId.create({ artist, title })
      expect(id1.equals(id2)).toBeTruthy()
    })

    test('returns false for different title', () => {
      const title1 = Title.unsafe(TITLE)
      const title2 = Title.unsafe('outro titulo')
      const artist = Artist.unsafe(ARTIST)
      const id1 = AlbumId.create({ artist, title: title1 })
      const id2 = AlbumId.create({ artist, title: title2 })
      expect(id1.equals(id2)).toBeFalsy()
    })

    test('returns false for different artist', () => {
      const title = Title.unsafe(TITLE)
      const artist1 = Artist.unsafe(ARTIST)
      const artist2 = Artist.unsafe(' outro artista')
      const id1 = AlbumId.create({ artist: artist1, title })
      const id2 = AlbumId.create({ artist: artist2, title })
      expect(id1.equals(id2)).toBeFalsy()
    })
  })
})
