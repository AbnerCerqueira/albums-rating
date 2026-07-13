export type TryCatchResult<T, E> =
  | { result: T; exception: null }
  | { result: null; exception: E }

export async function asyncTryCatch<T, E = Error>(
  promise: Promise<T>,
  finallyFn?: () => void | Promise<void>
): Promise<TryCatchResult<T, E>> {
  try {
    const result = await promise
    return { exception: null, result }
  } catch (e) {
    const error = e as E
    return { exception: error, result: null }
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
    return { exception: null, result }
  } catch (e) {
    const error = e as E
    return { exception: error, result: null }
  } finally {
    if (finallyFn) {
      finallyFn()
    }
  }
}
