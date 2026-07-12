import { z } from 'zod';

export const subscribeSchema = z.object({
  body: z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address') }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
