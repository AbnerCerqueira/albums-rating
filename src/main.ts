import { app } from './app'
import { env } from './infra/config/envs'
import { logger } from './infra/lib/logging/logger'
import { startServer } from './server'

async function main() {
  await startServer()

  const port = env.PORT
  app.listen({ host: '0.0.0.0', port })
  logger.info('server is running', { port })
}

main().catch((err) => {
  logger.error(err)
})
