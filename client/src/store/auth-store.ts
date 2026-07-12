import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string) => void;
  updateUser: (user: User) => void;
  setAccessToken: (accessToken: string | null) => void;
  clearSession: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,
      setSession: (user, accessToken) => set({ user, accessToken }),
      updateUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'estatein-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
