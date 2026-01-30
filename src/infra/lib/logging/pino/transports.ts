import pino from 'pino'
import type { LogContext, LogSeverity, Transport } from '../logger'
import { pinoBaseConfig } from './config'

export const pinoPrettyConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}

export class ConsoleTransport implements Transport {
  private readonly pino = pino({ ...pinoPrettyConfig, ...pinoBaseConfig })

  public log(
    severity: LogSeverity,
    message: string,
    context?: LogContext
  ): void {
    switch (severity) {
      case 'debug': {
        this.pino.debug({ message, ...context })
        return
      }
      case 'info': {
        this.pino.info({ message, ...context })
        return
      }
      case 'warn': {
        this.pino.warn({ message, ...context })
        return
      }
      case 'error': {
        this.pino.error({ message, ...context })
        return
      }
      default: {
        throw new Error('severity no supported', { cause: severity })
      }
    }
  }
}
