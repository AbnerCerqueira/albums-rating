import pino from 'pino'
import type { LogSeverity, Transport } from '../logger'

export interface FileTransportOptions {
  filePath: string
  minLevel?: LogSeverity
}

export function createFileTransport(options: FileTransportOptions): Transport {
  const { filePath, minLevel = 'debug' } = options

  const p = pino({
    level: minLevel,
    transport: {
      options: { destination: filePath, mkdir: true },
      target: 'pino/file',
    },
  })

  return {
    log(severity, message, context) {
      p[severity]({ ...context, msg: message })
    },
  }
}
