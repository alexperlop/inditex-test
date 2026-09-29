import { z } from 'zod';

const serverSchema = z.object({
  PHONE_API_URL: z.string().url(),
  PHONE_API_KEY: z.string().min(1, 'PHONE_API_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse({
    PHONE_API_URL: process.env.PHONE_API_URL,
    PHONE_API_KEY: process.env.PHONE_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid server environment variables: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}
