import pino from 'pino'
import { BaseException } from '@/contexts/!common/exceptions'

export const serializers = {
  err: (err: Error) => {
    if (err instanceof BaseException) {
      const { message, ...cleaned } = err.toObject()
      return cleaned
    }

    return {
      cause: err.cause,
      stack: err.stack,
      type: err.name,
    }
  },
}

const formatters = {
  level(label: string) {
    return { level: label }
  },
}

const pinoKeys = {
  base: null,
  errorKey: 'exception',
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
}

export const pinoBaseConfig = {
  formatters,
  serializers,
  ...pinoKeys,
}
