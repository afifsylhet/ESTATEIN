import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  SEED_ADMIN_NAME: z.string().default('Estatein Admin'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@estatein.com'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('ChangeMe123!'),
  // SMTP credentials for transactional email (e.g. password reset). Optional so
  // the server still boots without them; email features degrade gracefully.
  // `.trim()` guards against stray whitespace pasted into the .env file.
  EMAIL_USER: z.string().trim().optional(),
  EMAIL_PASS: z.string().trim().optional(),
  EMAIL_FROM: z.string().trim().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Check .env against .env.example.');
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
