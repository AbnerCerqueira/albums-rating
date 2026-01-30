import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PublicId } from '@/contexts/!common/public-id'
import { errorResponse, HttpStatus } from '@/infra/http/http-status'
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
        tags: [tags.catalog],
        params,
        response: {
          [HttpStatus.OK]: zodAlbumDTO,
          [HttpStatus.NOT_FOUND]: errorResponse,
        },
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
