export type PasswordEncoderService = {
  encode: (password: string) => Promise<string>
  match: (password: string, hashedPassword: string) => Promise<boolean>
}
