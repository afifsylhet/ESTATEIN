'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/modules/auth/schema';
import { useForgotPassword } from '@/modules/auth/hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotPassword.mutate(values, {
      // Show the neutral confirmation regardless of whether the account exists,
      // so we never reveal which emails are registered.
      onSuccess: () => setSubmittedEmail(values.email),
    });
  };

  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Reset your password</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Enter your email and, if an account exists, we&apos;ll send you a reset link.
          </p>
        </div>

        {submittedEmail ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm">
            If an account with <span className="font-medium">{submittedEmail}</span> exists, a password reset link is on
            its way. Check your inbox — the link expires in 1 hour.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" loading={forgotPassword.isPending}>
              <Mail /> Send reset link
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--muted-foreground)]">
          <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
