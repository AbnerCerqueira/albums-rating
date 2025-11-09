export type ErrorAsValueParams = {
  message: string
  cause?: unknown
  namespace?: string
}

export abstract class ErrorAsValue extends Error {
  public constructor(params: ErrorAsValueParams) {
    const { message, cause, namespace } = params
    super(message)
    this.name = `${namespace}.${this.constructor.name}`
    this.cause = cause
    this.stack = undefined
  }
}
