import { model, Schema, type SchemaTypeOptions } from 'mongoose'

export type UserData = {
  username: string
  password: string
}

type UserSchema = {
  [K in keyof UserData]: SchemaTypeOptions<UserData>[K]
}

const userSchema: UserSchema = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}

const user = new Schema<UserSchema>(userSchema, {
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
})

export const UserModel = model('users', user)
