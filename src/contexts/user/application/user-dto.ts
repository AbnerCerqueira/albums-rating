import z from 'zod'
import type { User } from '@/contexts/user/domain/user'

export const zodUserDTO = z.object({
  email: z.email(),
  publicId: z.uuidv7(),
  username: z.string(),
})

export type UserDTO = z.infer<typeof zodUserDTO>

export function toDTO(user: User): UserDTO {
  return {
    email: user.id.email,
    publicId: user.publicId.value,
    username: user.id.username,
  }
}
