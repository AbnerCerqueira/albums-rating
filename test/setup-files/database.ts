import mongoose from 'mongoose'
import z from 'zod'

const uri = z.string().parse(process.env.MONGODB_URI)

beforeAll(async () => {
  await mongoose.connect(uri)
  await mongoose.syncIndexes()
})

afterAll(async () => {
  await mongoose.disconnect()
})
