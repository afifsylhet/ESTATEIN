'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '../schema';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Save favorites, track inquiries, and get personalized recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit((values) => registerUser.mutate(values))} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" invalid={!!errors.name} {...register('name')} />
          {errors.name && <p className="text-sm text-[var(--color-destructive)]">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} />
          {errors.email && <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" invalid={!!errors.password} {...register('password')} />
          {errors.password && <p className="text-sm text-[var(--color-destructive)]">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-sm text-[var(--color-destructive)]">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" loading={registerUser.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
