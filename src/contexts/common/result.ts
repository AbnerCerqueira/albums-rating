export type Result<T, E> = { isOk: true; value: T } | { isOk: false; error: E }

export function ok<T>(value: T): Result<T, never> {
  return { isOk: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { isOk: false, error }
}

export function unwrap<T, E>(result: Result<T, E>) {
  return result.isOk
    ? ([result.value, undefined] as const)
    : ([undefined, result.error] as const)
}
