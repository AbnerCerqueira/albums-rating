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
import { env } from './infra/config/envs'
import { routes } from './infra/http/routes'
import { tags } from './infra/http/tags'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

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
