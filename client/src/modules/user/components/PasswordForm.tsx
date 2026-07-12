'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdatePassword } from '../hooks/useUpdateProfile';
import { useSession } from '@/modules/auth/hooks/useSession';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Include a lowercase letter')
      .regex(/[A-Z]/, 'Include an uppercase letter')
      .regex(/[0-9]/, 'Include a number')
      .regex(/[^A-Za-z0-9]/, 'Include a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type PasswordInput = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const { user } = useSession();
  const updatePassword = useUpdatePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) });

  if (user?.provider === 'google') {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        You signed up with Google, so there&apos;s no password to manage here.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => updatePassword.mutate(values, { onSuccess: () => reset() }))}
      className="max-w-md space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" type="password" invalid={!!errors.currentPassword} {...register('currentPassword')} />
        {errors.currentPassword && <p className="text-sm text-[var(--color-destructive)]">{errors.currentPassword.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" type="password" invalid={!!errors.newPassword} {...register('newPassword')} />
        {errors.newPassword && <p className="text-sm text-[var(--color-destructive)]">{errors.newPassword.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" type="password" invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-sm text-[var(--color-destructive)]">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" loading={updatePassword.isPending}>
        Update password
      </Button>
    </form>
  );
}
