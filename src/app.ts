import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { BaseException } from './contexts/!common/exceptions'
import { env } from './infra/config/envs'
import { routes } from './infra/http'
import { HttpStatus } from './infra/http/http-status'
import { tags } from './infra/http/tags'
import { logger } from './infra/lib/logging/logger'

export const app = fastify({
  logger: env.PROFILE === 'development',
}).withTypeProvider<ZodTypeProvider>()

app.setErrorHandler((error, request, reply) => {
  const context = {
    http: {
      method: request.method,
      path: request.url,
      request: {
        id: request.id,
        pathParams: request.params,
        queryParams: request.query,
      },
    },
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    const message =
      error.validation
        ?.map((v) => `${v.instancePath}: ${v.message}`)
        .join('; ') ?? "Request doesn't match the schema"
    return reply.status(HttpStatus.BAD_REQUEST).send({ message })
  }

  if (isResponseSerializationError(error)) {
    logger.error(error as Error, context)
    return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Response doesn't match the schema",
    })
  }

  const message =
    error instanceof BaseException ? error.message : 'Internal server error'

  logger.error(error as Error, context)
  reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message })
})

app.register(fastifyCors)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '1d' },
})

if (env.PROFILE === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      components: {
        securitySchemes: {
          bearerAuth: {
            bearerFormat: 'JWT',
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'API for music review',
        title: 'My albums',
        version: '1.0.0',
      },
      servers: [],
      tags: [
        {
          name: tags.healthCheck,
        },
        {
          name: tags.user,
        },
        {
          name: tags.catalog,
        },
      ],
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: false,
    },
  })
}

app.register(routes, { prefix: '/api' })
