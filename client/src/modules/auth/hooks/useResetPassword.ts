'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { resetPasswordRequest } from '../api';

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: { token: string; password: string }) => resetPasswordRequest(input),
    onSuccess: () => {
      toast({ title: 'Password updated', description: 'You can now log in with your new password.', variant: 'success' });
      router.push('/login');
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not reset your password. Please try again.';
      toast({ title: 'Reset failed', description: message, variant: 'error' });
    },
  });
}
