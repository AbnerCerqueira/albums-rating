import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect } from 'mongoose'
import type { Environment } from 'vitest/environments'

const database: Environment = {
  name: 'custom',
  transformMode: 'ssr',
  async setup() {
    const mongodb = await MongoMemoryServer.create()
    const uri = mongodb.getUri()
    const db = await connect(uri)
    return {
      async teardown() {
        await db.disconnect()
        await mongodb.stop()
      },
    }
  },
}

export default database
