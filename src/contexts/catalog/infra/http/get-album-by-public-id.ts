import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PublicId } from '@/contexts/shared/public-id'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { getAlbumByPublicIdUseCase } from '../compose'

const params = z.object({
  publicId: z.string(),
})

export const getAlbumByPublicIdRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/:publicId',
    {
      schema: {
        params,
        response: {
          [HttpStatus.OK]: zodAlbumDTO,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const result = await getAlbumByPublicIdUseCase.execute({
        publicId: PublicId.unsafe(request.params.publicId),
      })

      if (!result.ok) {
        return reply
          .status(HttpStatus.NOT_FOUND)
          .send({ message: result.error.message })
      }

      return reply.send(result.value)
    }
  )
}
