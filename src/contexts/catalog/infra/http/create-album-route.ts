import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { ConflictError } from '@/contexts/!common/errors'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { zodCreateAlbumUseCaseRequest } from '../../application/create-albums-use-case'
import { createAlbumUseCase } from '../compose'

export const createAlbumRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '',
    {
      schema: {
        body: zodCreateAlbumUseCaseRequest,
        response: {
          [HttpStatus.CONFLICT]: InfraSchemaUtils.errorResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: InfraSchemaUtils.errorResponse,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
          [HttpStatus.OK]: zodAlbumDTO,
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const { body } = request

      const result = await createAlbumUseCase.execute(body)

      if (result.ok) {
        return reply.send(result.value)
      }

      return reply
        .status(
          result.error instanceof ConflictError
            ? HttpStatus.CONFLICT
            : HttpStatus.BAD_REQUEST
        )
        .send({ message: result.error.message })
    }
  )
}
