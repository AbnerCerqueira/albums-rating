import type { User } from '../domain/user'

export type UserDTO = {
  username: string
}

function toDTO(user: User): UserDTO {
  return {
    username: user.id.username,
  }
}

export const UserDTOMapper = { toDTO }
