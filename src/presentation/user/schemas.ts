import z from 'zod'
import type { UserDTO } from '@/contexts/user/application/user-dto'

export const userResponse = z.object({
  username: z.string(),
}) satisfies z.ZodType<UserDTO>
