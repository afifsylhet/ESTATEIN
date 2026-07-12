import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
    icon: z.string().trim().optional(),
    description: z.string().trim().max(300).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60).optional(),
    icon: z.string().trim().optional(),
    description: z.string().trim().max(300).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});
