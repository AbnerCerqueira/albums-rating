import pino from 'pino'
import { BaseException } from '@/contexts/common/excptions'

export const serializers = {
  err: (err: Error) => {
    if (err instanceof BaseException) {
      // biome-ignore lint/correctness/noUnusedVariables: necessário para excluir o message
      const { message, ...cleaned } = err.toObject()
      return cleaned
    }

    return {
      type: err.name,
      stack: err.stack,
      cause: err.cause,
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
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  errorKey: 'exception',
}

export const pinoBaseConfig = {
  serializers,
  formatters,
  ...pinoKeys,
}
