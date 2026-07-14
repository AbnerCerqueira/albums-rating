import { ConsoleTransport } from './pino/transports'

export type LogSeverity = 'debug' | 'info' | 'warn' | 'error'

export interface Transport {
  log(severity: LogSeverity, message: string, context?: LogContext): void
}

export type LogContext = Record<string, unknown>
export interface Logger {
  addTransport(transport: Transport): void
  debug(message: string, context?: LogContext): void
  error(exception: Error, context?: LogContext): void
  info(message: string, context?: LogContext): void
  removeTransport(transport: Transport): void
  warn(message: string, context?: LogContext): void
}

export class LoggerImpl implements Logger {
  private readonly transports: Transport[] = []

  public debug(message: string, context?: LogContext): void {
    for (const transport of this.transports) {
      transport.log('debug', message, context)
    }
  }

  public info(message: string, context?: LogContext): void {
    for (const transport of this.transports) {
      transport.log('info', message, context)
    }
  }

  public warn(message: string, context?: LogContext): void {
    for (const transport of this.transports) {
      transport.log('warn', message, context)
    }
  }

  public error(exception: Error, context?: LogContext): void {
    for (const transport of this.transports) {
      transport.log('error', exception.message, { context, exception })
    }
  }

  public addTransport(transport: Transport): void {
    this.transports.push(transport)
  }

  public removeTransport(transport: Transport): void {
    this.transports.filter((t) => t !== transport)
  }
}

export const logger = new LoggerImpl()
logger.addTransport(new ConsoleTransport())
