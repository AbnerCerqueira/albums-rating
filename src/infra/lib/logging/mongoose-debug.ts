import mongoose from 'mongoose'
import { logger } from './logger'

export function enableQueryLogging(): void {
  mongoose.set(
    'debug',
    (collectionName: string, methodName: string, ...methodArgs: unknown[]) => {
      logger.debug(`db.${collectionName}.${methodName}`, {
        args: methodArgs,
      })
    }
  )
}
