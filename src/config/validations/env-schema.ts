import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_DB_NAME: z.string(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST_NAME: z.string(),
  POSTGRES_DB_PORT: z.string().pipe(z.coerce.number()).optional(),
  JWT_SECRET: z.string(),
  ENCRYPTION_ALGORITHM: z.string(),
  ENCRYPTION_VECTOR: z.string(),
  ENCRYPTION_SECRET: z.string(),
  PORT: z.string().pipe(z.coerce.number()),
  CORS_WHITELIST: z.string(),
  NODE_ENV: z.string(),
  DEBUG: z.string().optional(),
  MAIL_EMAIL: z.string(),
  MAIL_PASSWORD: z.string(),
});
