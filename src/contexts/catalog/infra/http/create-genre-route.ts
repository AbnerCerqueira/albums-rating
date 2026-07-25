import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ConflictError } from '@/contexts/!common/errors'
import { zodGenreDTO } from '@/contexts/catalog/application/genre-dto'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { createGenreUseCase } from '../compose'

const createGenreBody = z.object({
  name: z.string(),
})

const createGenreResponse = zodGenreDTO

export const createGenreRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/genres',
    {
      schema: {
        body: createGenreBody,
        response: {
          [HttpStatus.CONFLICT]: InfraSchemaUtils.errorResponse,
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.INTERNAL_SERVER_ERROR]: InfraSchemaUtils.errorResponse,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
          [HttpStatus.CREATED]: createGenreResponse,
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const { body } = request

      const result = await createGenreUseCase.execute({ name: body.name })

      if (result.ok) {
        return reply.status(HttpStatus.CREATED).send(result.value)
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
