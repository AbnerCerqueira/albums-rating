export class Failure<F, S> {
  public readonly value: F

  public constructor(value: F) {
    this.value = value
  }

  public isSuccess(): this is Success<F, S> {
    return false
  }

  public isFailure(): this is Failure<F, S> {
    return true
  }
}

export class Success<F, S> {
  public readonly value: S

  public constructor(value: S) {
    this.value = value
  }

  public isSuccess(): this is Success<F, S> {
    return true
  }

  public isFailure(): this is Failure<F, S> {
    return false
  }
}

export type Either<F, S> = Failure<F, S> | Success<F, S>

export const failure = <F, S>(value: F): Either<F, S> => new Failure(value)

export const success = <F, S>(value: S): Either<F, S> => new Success(value)
