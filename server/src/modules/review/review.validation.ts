import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    property: z.string().min(1, 'Property is required'),
    rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().trim().min(5, 'Comment must be at least 5 characters').max(1000),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
