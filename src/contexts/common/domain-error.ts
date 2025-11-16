abstract class ErrorAsValue {
  public constructor(public readonly message: string) {}
}

export namespace DomainError {
  export class Conflict extends ErrorAsValue {}
  export class InvalidArgument extends ErrorAsValue {}
}
