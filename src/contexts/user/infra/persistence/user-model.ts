import { model, Schema } from 'mongoose'

export type UserData = {
  email: string
  username: string
  password: string
  publicId: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserData>(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    publicId: {
      index: true,
      required: true,
      type: String,
      unique: true,
    },
    username: {
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const UserModel = model('users', userSchema)
