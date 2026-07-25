import { GenreId } from '@/contexts/catalog/domain/value-objects/genre-id'

export const TITLE = 'Álbum Teste'
export const ARTIST = 'Artista Teste'
export const GENRE = 'Gênero'
export const GENRE_SLUG = 'genero'
export const GENRE_ID = GenreId.unsafe(GENRE_SLUG)
export const FORMAT = 'LP' as const
export const RELEASE_DATE = new Date('2026-07-13')
