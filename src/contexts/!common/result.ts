export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { error, ok: false }
}

export function unwrap<T, E>(result: Result<T, E>) {
  return result.ok
    ? ([result.value, null] as const)
    : ([null, result.error] as const)
}

export function extract<T, E>(result: Result<T, E>): T {
  const [value, error] = unwrap(result)
  if (error) {
    throw error
  }
  return value as T
}
