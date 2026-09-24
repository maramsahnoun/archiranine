import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().default('127.0.0.1'), DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().min(1), DB_USER: z.string().min(1), DB_PASSWORD: z.string(),
  FRONTEND_URL: z.string().url(), ADMIN_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32).refine(value=>!/replace-with|change-me|generate-with|placeholder|example-secret/i.test(value),{message:'must be a generated random secret, not a template value'}), UPLOAD_DIR: z.string().default('public/uploads'),
  PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) throw new Error(`Invalid environment configuration: ${parsed.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; ')}`);
export const env = parsed.data;
