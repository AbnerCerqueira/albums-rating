import pino from 'pino'
import { createFileTransport } from './transports/file'

export type LogSeverity = 'debug' | 'info' | 'warn' | 'error'

export interface Transport {
  log: (
    severity: LogSeverity,
    message: string,
    context?: Record<string, unknown>
  ) => void
}

export interface Logger {
  addTransport: (transport: Transport) => void
  debug: (message: string, context?: Record<string, unknown>) => void
  error: (error: unknown, context?: Record<string, unknown>) => void
  info: (message: string, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>) => void
}

class LoggerImpl implements Logger {
  private readonly transports: Transport[] = []

  addTransport(transport: Transport): void {
    this.transports.push(transport)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context)
  }

  error(error: unknown, context?: Record<string, unknown>): void {
    const message = error instanceof Error ? error.message : String(error)
    this.log('error', message, { ...context, err: error })
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context)
  }

  private log(
    severity: LogSeverity,
    message: string,
    context?: Record<string, unknown>
  ): void {
    for (const transport of this.transports) {
      transport.log(severity, message, context)
    }
  }
}

export const logger = new LoggerImpl()
logger.addTransport(createConsoleTransport())
logger.addTransport(createFileTransport({ filePath: 'logs/app.log' }))
logger.addTransport(
  createFileTransport({ filePath: 'logs/errors.log', minLevel: 'error' })
)

function createConsoleTransport(): Transport {
  const p = pino({ transport: { target: 'pino-pretty' } })

  return {
    log(severity, message, context) {
      p[severity]({ ...context, msg: message })
    },
  }
}
