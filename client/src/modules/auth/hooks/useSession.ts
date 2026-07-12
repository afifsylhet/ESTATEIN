'use client';

import { useAuthStore } from '@/store/auth-store';

/** Convenience hook exposing the current session and role helpers. */
export function useSession() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading: !isHydrated,
  };
}
