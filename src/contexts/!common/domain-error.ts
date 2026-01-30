abstract class ErrorAsValue {
  public constructor(public readonly message: string) {}
}

export namespace DomainError {
  export class InvalidArgument extends ErrorAsValue {}
  export class Conflict extends ErrorAsValue {}
}
