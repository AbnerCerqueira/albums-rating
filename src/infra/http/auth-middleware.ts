import type { FastifyReply, FastifyRequest } from 'fastify'
import { asyncTryCatch } from '@/contexts/!common/try-catch-wrapper'
import { HttpStatus } from './http-status'

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { exception } = await asyncTryCatch(request.jwtVerify())

  if (exception) {
    return reply.status(HttpStatus.UNAUTHORIZED).send({
      message: 'Token inválido ou ausente',
    })
  }
}
