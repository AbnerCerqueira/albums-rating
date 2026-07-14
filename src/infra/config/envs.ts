import z from 'zod'

const profiles = ['development', 'production', 'test'] as const

const envSchema = {
  JWT_SECRET: z.string().default('mysecret'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/albums-rating'),
  PORT: z.coerce.number().default(3000),
  PROFILE: z.enum(profiles).default('development'),
}

export const env = z.object(envSchema).parse(process.env)
