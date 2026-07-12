'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { forgotPasswordRequest } from '../api';
import type { ForgotPasswordInput } from '../schema';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => forgotPasswordRequest(input),
    onSuccess: () => {
      toast({ title: 'Check your inbox', description: 'If an account exists, a reset link is on its way.', variant: 'success' });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.';
      toast({ title: 'Request failed', description: message, variant: 'error' });
    },
  });
}
