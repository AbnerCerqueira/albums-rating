import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { Pagination } from '@/contexts/!common/pagination'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { AlbumDTOMapper, zodAlbumDTO } from '../../application/album-dto'
import { albumRepository } from '../compose'

const okResponse = z.object({
  albums: zodAlbumDTO.array(),
  ...InfraSchemaUtils.paginatedRoutesResponse.shape,
})

export const getAlbumsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '',
    {
      schema: {
        querystring: InfraSchemaUtils.paginationQuerystring,
        response: {
          [HttpStatus.OK]: okResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: InfraSchemaUtils.errorResponse,
        },
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const { query } = request

      const paginationResult = Pagination.create(query.page, query.size)
      if (!paginationResult.ok) {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: paginationResult.error.message })
      }

      const pagination = paginationResult.value

      const result = await albumRepository.find(pagination)

      return reply.status(HttpStatus.OK).send({
        albums: result.items.map((a) => AlbumDTOMapper.toDTO(a)),
        currentPage: result.currentPage,
        size: result.size,
        total: result.total,
        totalPages: result.totalPages,
      })
    }
  )
}
