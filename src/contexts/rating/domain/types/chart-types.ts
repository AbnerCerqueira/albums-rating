import type { Format } from '@/contexts/catalog/domain/album'

export type TopRatedFilters = {
  from?: number
  to?: number
  genre?: string
  format?: Format
}

export type PopularFilters = TopRatedFilters

export type ChartAlbumRaw = {
  averageRating: number
  reviewCount: number
  artist: string
  title: string
  publicId: string
  releaseDate: Date
  format: string
  genres: string[]
}
