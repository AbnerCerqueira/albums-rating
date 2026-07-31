import mongoose from 'mongoose'
import { refreshChartsUseCase } from './contexts/stats/infra/compose'
import { startChartsScheduler } from './contexts/stats/infra/jobs/charts-scheduler'
import { env } from './infra/config/envs'
import { logger } from './infra/lib/logging/logger'
import { enableQueryLogging } from './infra/lib/logging/mongoose-debug'

export async function startServer() {
  await mongoose.connect(env.MONGODB_URI)
  logger.debug('database connected', { uri: env.MONGODB_URI })
  await mongoose.syncIndexes()
  enableQueryLogging()

  if (env.PROFILE !== 'test') {
    startChartsScheduler(refreshChartsUseCase)
  }
}
