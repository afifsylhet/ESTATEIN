import { z } from 'zod';

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    role: z.string().trim().optional(),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(800),
    rating: z.coerce.number().min(1).max(5),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const moderateTestimonialSchema = z.object({
  body: z.object({ isApproved: z.boolean() }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});
