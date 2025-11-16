export type TryCatchResult<T, E> =
  | { result: T; error: null }
  | { result: null; error: E }

export async function asyncTryCatch<T, E = Error>(
  promise: Promise<T>,
  finallyFn?: () => void | Promise<void>
): Promise<TryCatchResult<T, E>> {
  try {
    const result = await promise
    return { result, error: null }
  } catch (e) {
    const error = e as E
    return { result: null, error }
  } finally {
    if (finallyFn) {
      await finallyFn()
    }
  }
}

export function tryCatch<T, E = Error>(
  fn: () => T,
  finallyFn?: () => void
): TryCatchResult<T, E> {
  try {
    const result = fn()
    return { result, error: null }
  } catch (e) {
    const error = e as E
    return { result: null, error }
  } finally {
    if (finallyFn) {
      finallyFn()
    }
  }
}
