import { model, Schema } from 'mongoose'

export type AlbumChartData = {
  albumId: string
  artist: string
  averageRating: number
  format: string
  genres: string[]
  genreSlugs: string[]
  publicId: string
  releaseDate: Date
  reviewCount: number
  title: string
  weightedScore: number
}

const albumChartSchema = new Schema<AlbumChartData>(
  {
    albumId: { index: true, required: true, type: String, unique: true },
    artist: { required: true, type: String },
    averageRating: { required: true, type: Number },
    format: { required: true, type: String },
    genreSlugs: [{ type: String }],
    genres: [{ type: String }],
    publicId: { required: true, type: String },
    releaseDate: { required: true, type: Date },
    reviewCount: { required: true, type: Number },
    title: { required: true, type: String },
    weightedScore: { required: true, type: Number },
  },
  { timestamps: false, versionKey: false }
)

albumChartSchema.index({ weightedScore: -1 })
albumChartSchema.index({ reviewCount: -1 })

export const AlbumChartModel = model<AlbumChartData>(
  'album_charts',
  albumChartSchema
)
