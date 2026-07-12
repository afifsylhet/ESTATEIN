'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordInput } from '../schema';
import { useResetPassword } from '../hooks/useResetPassword';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Invalid link</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            This password reset link is missing or malformed. Please request a new one.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Choose a new password</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Enter a new password for your account below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((values) => resetPassword.mutate({ token, password: values.password }))}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-[var(--color-destructive)]">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-[var(--color-destructive)]">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={resetPassword.isPending}>
          Reset password
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
