import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { uuidv7 } from 'uuidv7'
import type {
  ImageProvider,
  UploadImageParams,
} from '@/contexts/catalog/domain/image-provider'
import { env } from '@/infra/config/envs'
import { uploadsDir } from '@/infra/config/uploads'
import { logger } from '@/infra/lib/logging/logger'

export class LocalImageProvider implements ImageProvider {
  async upload(params: UploadImageParams): Promise<string> {
    await mkdir(uploadsDir, { recursive: true })

    const filename = `${params.publicId}-${uuidv7()}.${params.extension}`
    await writeFile(join(uploadsDir, filename), params.buffer)

    logger.info(`Cover uploaded: ${filename}`, { publicId: params.publicId })
    return `${env.PUBLIC_BASE_URL}/covers/${filename}`
  }

  async delete(url: string): Promise<void> {
    const filename = basename(url)
    if (!filename) {
      return
    }

    try {
      await unlink(join(uploadsDir, filename))
      logger.info(`Cover deleted: ${filename}`, { url })
    } catch (error) {
      if (isNotFound(error)) {
        return
      }
      throw error
    }
  }
}

function isNotFound(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}
