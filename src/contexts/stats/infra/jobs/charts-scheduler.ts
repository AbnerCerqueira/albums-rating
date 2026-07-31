import cron from 'node-cron'
import { logger } from '@/infra/lib/logging/logger'
import type { RefreshChartsUseCase } from '../../application/refresh-charts-use-case'

const EVERY_MONDAY_03 = '0 3 * * 1'

export function startChartsScheduler(useCase: RefreshChartsUseCase): void {
  cron.schedule(EVERY_MONDAY_03, async () => {
    logger.info('refreshing album charts')
    try {
      await useCase.execute()
      logger.info('album charts refreshed successfully')
    } catch (error) {
      logger.error(error, { context: 'charts-scheduler' })
    }
  })
  logger.info('charts scheduler started: Monday 03:00')
}
