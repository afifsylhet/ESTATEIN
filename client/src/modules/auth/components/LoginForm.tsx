'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '../schema';
import { useLogin } from '../hooks/useLogin';
import { DemoLoginButtons } from './DemoLoginButton';

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Log in to manage your saved properties and inquiries.</p>
      </div>

      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} />
          {errors.email && <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-[var(--color-accent)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" invalid={!!errors.password} {...register('password')} />
          {errors.password && <p className="text-sm text-[var(--color-destructive)]">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" loading={login.isPending}>
          Log in
        </Button>
      </form>

      <DemoLoginButtons />

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-[var(--color-accent)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
