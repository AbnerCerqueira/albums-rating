import { isAbsolute, join } from 'node:path'
import { env } from './envs'

export const uploadsDir = isAbsolute(env.UPLOAD_DIR)
  ? env.UPLOAD_DIR
  : join(process.cwd(), env.UPLOAD_DIR)
