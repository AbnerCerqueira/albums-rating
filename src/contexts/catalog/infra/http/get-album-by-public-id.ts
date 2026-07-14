import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PublicId } from '@/contexts/!common/public-id'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { AlbumDTOMapper, zodAlbumDTO } from '../../application/album-dto'
import { albumRepository } from '../!ioc/repositories'

const params = z.object({
  publicId: z.uuidv7(),
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
      const foundAlbum = await albumRepository.findByPublicId(
        new PublicId(request.params.publicId)
      )

      return foundAlbum
        ? reply.send(AlbumDTOMapper.toDTO(foundAlbum))
        : reply
            .status(HttpStatus.NOT_FOUND)
            .send({ message: 'Album não encontrado' })
    }
  )
}
