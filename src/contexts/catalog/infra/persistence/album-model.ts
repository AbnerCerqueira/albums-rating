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
      title: String,
      artist: String,
    },
    format: {
      type: String,
      enum: FORMATS,
      required: true,
    },
    genre: { type: String, required: true },
    publicId: { type: String, required: true },
    releaseDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      // biome-ignore lint/suspicious/noExplicitAny: faz sentido
      transform(_, ret: any) {
        const obj = ret
        obj.id = obj._id.toString()
        return obj
      },
    },
  }
)

albumSchema.index(
  {
    'domainId.title': 1,
    'domainId.artist': 1,
    publicId: 1,
  },
  { unique: true }
)

export const AlbumModel = model('albums', albumSchema)
