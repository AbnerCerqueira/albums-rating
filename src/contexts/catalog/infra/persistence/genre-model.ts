import { model, Schema } from 'mongoose'

export type GenreData = {
  slug: string
  name: string
  publicId: string
  createdAt: Date
  updatedAt: Date
}

const genreSchema = new Schema<GenreData>(
  {
    name: { required: true, type: String },
    publicId: { index: true, required: true, type: String, unique: true },
    slug: { index: true, required: true, type: String, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const GenreModel = model('genres', genreSchema)
