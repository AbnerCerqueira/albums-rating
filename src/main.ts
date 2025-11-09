import { app } from './app'
import { env } from './infra/config/envs'
import { logger } from './infra/lib/logging/logger'
import { startServer } from './server'

async function main() {
  await startServer()

  const port = env.PORT
  app.listen({ port, host: '0.0.0.0' })
  logger.info('server is running', { port })
}

main().catch((err) => {
  logger.error(err)
})
