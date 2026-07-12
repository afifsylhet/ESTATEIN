import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[+]?[\d\s()-]{7,20}$/, 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});

export const updatePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must include a lowercase letter')
        .regex(/[A-Z]/, 'Password must include an uppercase letter')
        .regex(/[0-9]/, 'Password must include a number')
        .regex(/[^A-Za-z0-9]/, 'Password must include a special character'),
      confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});

export const listUsersQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(),
    search: z.string().optional(),
  }),
  params: z.object({}).optional(),
});
