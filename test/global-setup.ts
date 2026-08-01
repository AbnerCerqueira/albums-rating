import { copyFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function setup() {
  const mongodb = await MongoMemoryServer.create()
  const uri = mongodb.getUri()
  process.env.MONGODB_URI = uri

  const uploadsDir = join(tmpdir(), 'albums-rating-covers-test')
  process.env.UPLOAD_DIR = uploadsDir

  mkdirSync(uploadsDir, { recursive: true })
  copyFileSync(
    join(process.cwd(), 'uploads', 'default-cover.png'),
    join(uploadsDir, 'default-cover.png')
  )

  return async function teardown() {
    await mongodb.stop()
  }
}
