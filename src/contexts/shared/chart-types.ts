export type ChartAlbumProjection = {
  albumId: string
  artist: string
  averageRating: number
  coverUrl: string
  format: string
  genres: string[]
  genreSlugs: string[]
  publicId: string
  releaseDate: Date
  reviewCount: number
  title: string
  weightedScore: number
}

export type ChartFilters = {
  from?: number
  to?: number
  genre?: string
  format?: string
}
