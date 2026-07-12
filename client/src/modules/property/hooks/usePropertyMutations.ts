'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { createPropertyRequest, updatePropertyRequest, deletePropertyRequest } from '../api';

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) => createPropertyRequest(formData),
    onSuccess: (res) => {
      toast({ title: 'Property listed', description: res.message, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      router.push('/dashboard/admin/properties');
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not create the listing.';
      toast({ title: 'Failed to list property', description: message, variant: 'error' });
    },
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) => updatePropertyRequest(id, formData),
    onSuccess: (res) => {
      toast({ title: 'Property updated', description: res.message, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      router.push('/dashboard/admin/properties');
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not update the listing.';
      toast({ title: 'Update failed', description: message, variant: 'error' });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePropertyRequest(id),
    onSuccess: (res) => {
      toast({ title: 'Property deleted', description: res.message, variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not delete the listing.';
      toast({ title: 'Delete failed', description: message, variant: 'error' });
    },
  });
}
