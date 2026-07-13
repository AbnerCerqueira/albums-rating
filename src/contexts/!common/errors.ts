import type { ErrorCode } from './error-code'
import { ErrorCode as EC } from './error-code'

export abstract class DomainError extends Error {
  abstract readonly code: ErrorCode

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class EmptyValueError extends DomainError {
  readonly code = EC.EMPTY_VALUE

  constructor(field: string) {
    super(`${field} não pode ser vazio`)
  }
}

export class InvalidFormatError extends DomainError {
  readonly code = EC.INVALID_FORMAT

  constructor(field: string, expected: string) {
    super(`Formato inválido ${field}. Esperado: ${expected}`)
  }
}

export class InvalidDateError extends DomainError {
  readonly code = EC.INVALID_DATE

  constructor(field: string) {
    super(`${field} inválido`)
  }
}

export class NotFoundError extends DomainError {
  readonly code = EC.NOT_FOUND

  constructor(resource: string) {
    super(`${resource} não encontrado`)
  }
}

export class ConflictError extends DomainError {
  readonly code = EC.CONFLICT_ERROR

  constructor(field: string) {
    super(`${field}     já existe(m)`)
  }
}

export class InvalidCredentialsError extends DomainError {
  readonly code = EC.INVALID_CREDENTIALS

  constructor() {
    super('Credenciais inválidas')
  }
}

export class InvalidPaginationError extends DomainError {
  readonly code = EC.INVALID_PAGINAION

  constructor() {
    super('Paginação inválida. Esperado: page >= 1 e size >= 1')
  }
}
