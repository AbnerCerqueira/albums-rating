import z from 'zod'

const profiles = ['development', 'production', 'test'] as const

const portSchema = z.coerce.number().default(3000)

const PORT = portSchema.parse(process.env.PORT)

const envSchema = {
  DEFAULT_COVER_URL: z
    .string()
    .default(`http://localhost:${PORT}/covers/default-cover.png`),
  JWT_SECRET: z.string().default('mysecret'),
  LOG_LEVEL: z.string().default('info'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/albums-rating'),
  PORT: portSchema,
  PROFILE: z.enum(profiles).default('development'),
  PUBLIC_BASE_URL: z.string().default(`http://localhost:${PORT}`),
  UPLOAD_DIR: z.string().default('uploads'),
}

export const env = z.object(envSchema).parse(process.env)
