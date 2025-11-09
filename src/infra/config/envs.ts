import z from 'zod'

const profiles = ['development', 'production', 'test'] as const

const envSchema = {
  PROFILE: z.enum(profiles).default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default('mysecret'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/albums-rating'),
}

export const env = z.object(envSchema).parse(process.env)
