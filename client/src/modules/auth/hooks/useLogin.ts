'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { loginRequest } from '../api';
import type { LoginInput } from '../schema';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => loginRequest(input),
    onSuccess: (res) => {
      setSession(res.data.user, res.data.accessToken);
      toast({ title: 'Welcome back!', description: 'You are now logged in.', variant: 'success' });
      // Honor the ?redirectTo=... set by the proxy middleware when it bounced an
      // unauthenticated visitor away from a protected route; fall back to the dashboard.
      const redirectTo = searchParams.get('redirectTo');
      router.push(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard');
      router.refresh();
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Login failed. Please try again.';
      toast({ title: 'Login failed', description: message, variant: 'error' });
    },
  });
}
