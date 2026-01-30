import type { User } from '../domain/user'

export type UserDTO = {
  publicId: string
  email: string
  username: string
}

function toDTO(user: User): UserDTO {
  const { id, publicId } = user
  const { email, username } = id
  return {
    email: email.value,
    username: username.value,
    publicId: publicId.toString(),
  }
}

export const UserDTOMapper = { toDTO }
