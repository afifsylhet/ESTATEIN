import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    subject: z.string().trim().min(3, 'Subject is required').max(150),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateContactStatusSchema = z.object({
  body: z.object({ status: z.enum(['new', 'read', 'resolved']) }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});
