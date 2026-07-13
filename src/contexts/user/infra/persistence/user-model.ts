import { model, Schema } from 'mongoose'

export type UserDataDomainId = {
  email: string
  username: string
}

export type UserData = {
  domainId: UserDataDomainId
  publicId: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserData>(
  {
    domainId: {
      email: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const UserModel = model('users', userSchema)
