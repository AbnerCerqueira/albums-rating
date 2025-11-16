export type Result<T, E> = { isOk: true; value: T } | { isOk: false; error: E }

export function ok<T>(data: T): Result<T, never> {
  return { isOk: true, value: data }
}

export function err<E>(error: E): Result<never, E> {
  return { isOk: false, error }
}
