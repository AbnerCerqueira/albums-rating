import z from 'zod'
import type { UserDTO } from '@/contexts/user/application/user-dto'

export const userResponse = z.object({
  publicId: z.uuidv7(),
  email: z.email(),
  username: z.string(),
}) satisfies z.ZodType<UserDTO>
