import z from 'zod'
import type { Genre } from '../domain/genre'

export const zodGenreDTO = z.object({
  name: z.string(),
  slug: z.string(),
})

export type GenreDTO = z.infer<typeof zodGenreDTO>

function toDTO(genre: Genre): GenreDTO {
  return {
    name: genre.name.value,
    slug: genre.slug,
  }
}

export const GenreDTOMapper = { toDTO }
