'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { updateProfileRequest, updateAvatarRequest, updatePasswordRequest } from '../api';

export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: { name?: string; phone?: string }) => updateProfileRequest(userId!, input),
    onSuccess: (res) => {
      updateUser(res.data);
      toast({ title: 'Profile updated', variant: 'success' });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not update profile.';
      toast({ title: 'Update failed', description: message, variant: 'error' });
    },
  });
}

export function useUpdateAvatar() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (formData: FormData) => updateAvatarRequest(userId!, formData),
    onSuccess: (res) => {
      updateUser(res.data);
      toast({ title: 'Avatar updated', variant: 'success' });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not update avatar.';
      toast({ title: 'Update failed', description: message, variant: 'error' });
    },
  });
}

export function useUpdatePassword() {
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      updatePasswordRequest(userId!, input),
    onSuccess: () => {
      toast({ title: 'Password updated', description: 'Use your new password next time you log in.', variant: 'success' });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not update password.';
      toast({ title: 'Update failed', description: message, variant: 'error' });
    },
  });
}
