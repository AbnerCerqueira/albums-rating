import { model, Schema } from 'mongoose'

export type UserData = {
  username: string
  password: string
}

const userSchema = new Schema<UserData>(
  {
    username: {
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

export const UserModel = model('users', userSchema)
