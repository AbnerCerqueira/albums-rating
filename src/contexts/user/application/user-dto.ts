import z from 'zod'
import type { User } from '@/contexts/user/domain/user'

export const zodUserDTO = z.object({
  email: z.email(),
  publicId: z.string().uuid(),
  username: z.string(),
})

export type UserDTO = z.infer<typeof zodUserDTO>

function toDTO(user: User): UserDTO {
  return {
    email: user.id.email.value,
    publicId: user.publicId.value,
    username: user.id.username.value,
  }
}

export const UserDTOMapper = { toDTO }
