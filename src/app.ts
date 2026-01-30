import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
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
  logger: env.PROFILE !== 'production',
}).withTypeProvider<ZodTypeProvider>()

app.setErrorHandler((error, request, reply) => {
  const message =
    error instanceof BaseException ? error.message : 'Internal server error'

  const context = {
    http: {
      path: request.url,
      method: request.method,
      request: {
        id: request.id,
        queryParams: request.query,
        pathParams: request.params,
      },
    },
  }

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
      info: {
        title: 'My albums',
        description: 'API for music review',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      servers: [],
      tags: [
        {
          name: tags.healthCheck,
        },
        {
          name: tags.user,
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
