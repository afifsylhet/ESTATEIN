'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/components/ui/toast';
import { logoutRequest } from '../api';

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearSession();
      toast({ title: 'Logged out', description: 'See you again soon!', variant: 'default' });
      router.push('/');
      router.refresh();
    },
    onError: () => {
      // Even if the server call fails, clear local session so the UI reflects reality.
      clearSession();
      router.push('/');
    },
  });
}
