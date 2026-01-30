import { model, Schema } from 'mongoose'

export type UserDataDomainId = {
  email: string
  username: string
}

export type UserData = {
  domainId: UserDataDomainId
  publicId: string
  password: string
}

const userSchema = new Schema<UserData>(
  {
    domainId: {
      email: String,
      username: String,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
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

userSchema.index(
  { 'domainId.email': 1, 'domainId.username': 1, publicId: 1 },
  { unique: true }
)

export const UserModel = model('users', userSchema)
