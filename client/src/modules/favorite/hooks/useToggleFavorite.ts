'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { addFavoriteRequest, removeFavoriteRequest } from '../api';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: string; isFavorited: boolean }) =>
      isFavorited ? removeFavoriteRequest(propertyId) : addFavoriteRequest(propertyId),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: variables.isFavorited ? 'Removed from favorites' : 'Added to favorites',
        variant: 'success',
      });
    },
    onError: () => {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'error' });
    },
  });
}
