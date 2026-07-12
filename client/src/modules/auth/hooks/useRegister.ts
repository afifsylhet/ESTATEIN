'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { registerRequest } from '../api';
import type { RegisterInput } from '../schema';

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: RegisterInput) => registerRequest(input),
    onSuccess: (res) => {
      setSession(res.data.user, res.data.accessToken);
      toast({ title: 'Account created', description: 'Welcome to Estatein!', variant: 'success' });
      router.push('/dashboard');
      router.refresh();
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.';
      toast({ title: 'Registration failed', description: message, variant: 'error' });
    },
  });
}
