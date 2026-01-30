import z from 'zod'
import type { User } from '../domain/user'

export const zodUserDTO = z.object({
  email: z.email(),
  username: z.string(),
  publicId: z.uuidv7(),
})

export type UserDTO = z.infer<typeof zodUserDTO>

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
