import { z } from 'zod';

export const createInquirySchema = z.object({
  body: z.object({
    property: z.string().min(1, 'Property is required'),
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    phone: z.string().trim().optional(),
    message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateInquiryStatusSchema = z.object({
  body: z.object({ status: z.enum(['new', 'contacted', 'closed']) }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});
