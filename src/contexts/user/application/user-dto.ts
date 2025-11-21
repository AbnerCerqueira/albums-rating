import type { User } from '../domain/user'

export type UserDTO = {
  publicId: string
  email: string
  username: string
}

function toDTO(user: User): UserDTO {
  return {
    publicId: user.id.toString(),
    email: user.props.email.value,
    username: user.props.username.value,
  }
}

export const UserDTOMapper = { toDTO }
