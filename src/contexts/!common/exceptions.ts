type ExceptionOptions = {
  type?: string
  cause?: Error
  metadata?: Record<string, unknown>
  origin: {
    component: string
    operation: string
    file: string
  }
}

type Cause = {
  type: string
  message?: string
  cause?: Cause | unknown
}

export type BaseExceptionParams = {
  message?: string
  options: ExceptionOptions
}

export abstract class BaseException extends Error {
  public type?: string
  public metadata: ExceptionOptions['metadata']
  public origin: ExceptionOptions['origin']
  public override cause?: Error

  public constructor(params: BaseExceptionParams) {
    const { message = 'No exception message was provided', options } = params
    super(message)
    this.name = this.constructor.name

    const { type, metadata, origin, cause } = options

    this.type = type ?? this.name
    this.cause = cause
    this.metadata = metadata
    this.origin = origin
  }

  public toObject() {
    return {
      cause: this.cause ? this.serializeCause(this.cause) : undefined,
      message: this.message,
      metadata: this.metadata,
      origin: this.origin,
      rootCause: this.getRootCause(),
      stack: this.stack,
      type: this.type,
    }
  }

  private serializeCause(error: Error, maxDepth = 3): Cause {
    if (maxDepth <= 0) {
      return { type: 'MaxDepthReached' }
    }

    return {
      cause:
        error.cause instanceof Error
          ? this.serializeCause(error.cause, maxDepth - 1)
          : undefined,
      message: error.message,
      // biome-ignore lint/style/noNonNullAssertion: se for instancia da BaseException sempre terá type
      type: error instanceof BaseException ? error.type! : error.name,
    }
  }

  public getRootCause() {
    let current: Error = this

    while (current.cause instanceof Error) {
      current = current.cause
    }

    return {
      message: current.message,
      type: current instanceof BaseException ? current.type : current.name,
    }
  }
}

export namespace ApplicationException {
  export class UnexpectedError extends BaseException {
    public constructor(params: BaseExceptionParams) {
      const { message = 'Unexpected error occur. Try again later', options } =
        params
      super({
        message,
        options: {
          ...options,
          type: 'ApplicationException.UnexpectedError',
        },
      })
    }
  }
}
