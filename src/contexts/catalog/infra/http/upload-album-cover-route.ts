import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { PublicId } from '@/contexts/shared/public-id'
import { HttpStatus } from '@/infra/http/http-status'
import { InfraSchemaUtils } from '@/infra/http/schemas'
import { tags } from '@/infra/http/tags'
import { zodAlbumDTO } from '../../application/album-dto'
import { uploadAlbumCoverUseCase } from '../compose'

const params = z.object({
  publicId: z.string(),
})

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Zod não expõe API pública para formatos customizados de string. Usamos o
// formato interno 'binary' para que o swagger-ui renderize um file input em
// requestBody multipart/form-data. .nullable() permite que o body continue
// sendo validado em requisições multipart (o body chega como null).
const binaryFormat = z.core._stringFormat(
  z.core.$ZodCustomStringFormat,
  'binary',
  () => true
)

const zodUploadCoverBody = z.object({ cover: binaryFormat }).nullable()

export const uploadAlbumCoverRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/:publicId/cover',
    {
      schema: {
        body: zodUploadCoverBody,
        consumes: ['multipart/form-data'],
        params,
        response: {
          [HttpStatus.BAD_REQUEST]: InfraSchemaUtils.errorResponse,
          [HttpStatus.NOT_FOUND]: InfraSchemaUtils.errorResponse,
          [HttpStatus.OK]: zodAlbumDTO,
          [HttpStatus.UNAUTHORIZED]: InfraSchemaUtils.errorResponse,
        },
        security: [{ bearerAuth: [] }],
        tags: [tags.catalog],
      },
    },
    async (request, reply) => {
      const file = await request.file()

      if (!file) {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: 'Arquivo de imagem é obrigatório' })
      }

      const extension = ALLOWED_IMAGE_TYPES[file.mimetype]
      if (!extension) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
          message: 'Formato de imagem inválido. Use JPEG, PNG ou WebP',
        })
      }

      const result = await uploadAlbumCoverUseCase.execute({
        buffer: await file.toBuffer(),
        extension,
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
