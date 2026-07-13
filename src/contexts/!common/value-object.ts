import {
  EmptyValueError,
  InvalidDateError,
  InvalidFormatError,
  InvalidLinkError,
} from './errors'
import type { Result } from './result'
import { err, ok } from './result'

export abstract class ValueObject<T> {
  protected readonly _value: T

  protected constructor(value: T) {
    this._value = value
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other._value)
  }

  protected static requireNonEmpty(
    value: string,
    field: string
  ): Result<string, EmptyValueError> {
    const trimmed = value.trim()
    if (!trimmed) {
      return err(new EmptyValueError(field))
    }
    return ok(trimmed)
  }

  protected static requireNonEmptyNormalized(
    value: string,
    field: string,
    casing: 'lower' | 'upper'
  ): Result<string, EmptyValueError> {
    const normalized =
      casing === 'lower'
        ? value.trim().toLowerCase()
        : value.trim().toUpperCase()
    if (!normalized) {
      return err(new EmptyValueError(field))
    }
    return ok(normalized)
  }

  protected static requireMatchesRegex(
    value: string,
    regex: RegExp,
    field: string,
    expected: string
  ): Result<void, InvalidFormatError> {
    if (!regex.test(value)) {
      return err(new InvalidFormatError(field, expected))
    }
    return ok(undefined)
  }

  protected static requireValidDate(
    date: Date,
    field: string
  ): Result<Date, InvalidDateError> {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return err(new InvalidDateError(field))
    }
    return ok(new Date(date.getTime()))
  }

  protected static requireValidLink(
    link: string,
    field: string
  ): Result<string, InvalidLinkError> {
    return URL.canParse(link) ? ok(link) : err(new InvalidLinkError(field))
  }
}
