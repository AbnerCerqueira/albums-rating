import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { unwrap } from '@/contexts/!common/result'
import { errorResponse, HttpStatus } from '@/infra/http/http-status'
import { paginationQuerystring } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { AlbumDTOMapper, zodAlbumDTO } from '../../application/album-dto'
import { albumRepository } from '../!ioc/repositories'

const okResponse = z.object({
  albums: zodAlbumDTO.array(),
  currentPage: z.number(),
  size: z.number(),
})

export const getAlbumsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '',
    {
      schema: {
        tags: [tags.catalog],
        querystring: paginationQuerystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { query } = request

      const [pagination, paginationErr] = unwrap(
        Pagination.create(query.page, query.size)
      )
      if (paginationErr) {
        return reply.status(HttpStatus.BAD_REQUEST).send(paginationErr)
      }

      const albums = await albumRepository.find(pagination)

      return reply.status(HttpStatus.OK).send({
        albums: albums.map((a) => AlbumDTOMapper.toDTO(a)),
        currentPage: pagination.page,
        size: pagination.size,
      })
    }
  )
}
