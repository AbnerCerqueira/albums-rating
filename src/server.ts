import mongoose from 'mongoose'
import { env } from './infra/config/envs'

export async function startServer() {
  await mongoose.connect(env.MONGODB_URI)
  await mongoose.syncIndexes()
}
