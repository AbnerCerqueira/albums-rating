import { model, Schema } from 'mongoose'
import { FORMATS, type Format } from '@/contexts/catalog/domain/album'

export type AlbumDataDomainId = {
  title: string
  artist: string
}

export type AlbumData = {
  domainId: AlbumDataDomainId
  publicId: string
  releaseDate: Date
  genre: string
  format: Format
}

const albumSchema = new Schema<AlbumData>(
  {
    domainId: {
      artist: String,
      title: String,
    },
    format: {
      enum: FORMATS,
      required: true,
      type: String,
    },
    genre: { required: true, type: String },
    publicId: { index: true, required: true, type: String, unique: true },
    releaseDate: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
    toObject: {
      // biome-ignore lint/suspicious/noExplicitAny: faz sentido
      transform(_, ret: any) {
        const obj = ret
        obj.id = obj._id.toString()
        return obj
      },
    },
    versionKey: false,
  }
)

albumSchema.index(
  { 'domainId.artist': 1, 'domainId.title': 1 },
  { unique: true }
)

export const AlbumModel = model('albums', albumSchema)
