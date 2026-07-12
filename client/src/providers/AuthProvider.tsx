'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hydrates the client-side auth store on first mount. Zustand's `persist` middleware
 * hydrates asynchronously, so consumers should check `isHydrated` before branching
 * on auth state to avoid a flash of logged-out UI.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  React.useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  return <>{children}</>;
}
