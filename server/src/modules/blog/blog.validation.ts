import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
    excerpt: z.string().trim().min(10, 'Excerpt is required').max(300),
    content: z.string().trim().min(50, 'Content must be at least 50 characters'),
    tags: z.array(z.string()).optional().default([]),
    isPublished: z.coerce.boolean().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateBlogSchema = z.object({
  body: createBlogSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});
