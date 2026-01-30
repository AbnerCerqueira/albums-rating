import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { DomainError } from '@/contexts/!common/domain-error'
import { errorResponse, HttpStatus } from '@/infra/http/http-status'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { zodCreateAlbumUseCaseRequest } from '../../application/create-albums-use-case'
import { createAlbumUseCase } from '../!ioc/use-cases'

// TODO: adicionar middleware para autenticação
export const createAlbumRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '',
    {
      schema: {
        tags: [tags.catalog],
        body: zodCreateAlbumUseCaseRequest,
        response: {
          [HttpStatus.CONFLICT]: errorResponse,
          [HttpStatus.BAD_REQUEST]: errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: errorResponse,
          [HttpStatus.OK]: zodAlbumDTO,
        },
      },
    },
    async (request, reply) => {
      const { body } = request

      const result = await createAlbumUseCase.execute(body)

      if (result.isOk) {
        return reply.send(result.value)
      }

      return reply
        .status(
          result.error instanceof DomainError.Conflict
            ? HttpStatus.CONFLICT
            : HttpStatus.BAD_REQUEST
        )
        .send(result.error)
    }
  )
}
