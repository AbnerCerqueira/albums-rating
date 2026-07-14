import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function setup() {
  const mongodb = await MongoMemoryServer.create()
  const uri = mongodb.getUri()
  process.env.MONGODB_URI = uri

  return async function teardown() {
    await mongodb.stop()
  }
}
