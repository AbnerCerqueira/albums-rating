export namespace ApplicationService {
  export interface PasswordEncoder {
    encode(password: string): Promise<string>
    match(password: string, hashedPassword: string): Promise<boolean>
  }
}
