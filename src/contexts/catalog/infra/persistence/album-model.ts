import { model, Schema, type Types } from 'mongoose'
import { FORMATS, type Format } from '@/contexts/catalog/domain/album'
import type { GenreData } from './genre-model'

export type AlbumData = {
  artist: string
  title: string
  publicId: string
  releaseDate: Date
  genres: Types.ObjectId[]
  format: Format
  createdAt: Date
  updatedAt: Date
}

export type AlbumPopulated = Omit<AlbumData, 'genres'> & {
  genres: GenreData[]
}

export type AlbumPersistenceData = Omit<AlbumData, 'genres'> & {
  genres: string[]
}

const albumSchema = new Schema<AlbumData>(
  {
    artist: { required: true, type: String },
    format: {
      enum: FORMATS,
      required: true,
      type: String,
    },
    genres: [{ ref: 'genres', type: Schema.Types.ObjectId }],
    publicId: { index: true, required: true, type: String, unique: true },
    releaseDate: {
      required: true,
      type: Date,
    },
    title: { required: true, type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

albumSchema.index({ artist: 1, title: 1 }, { unique: true })

export const AlbumModel = model('albums', albumSchema)
