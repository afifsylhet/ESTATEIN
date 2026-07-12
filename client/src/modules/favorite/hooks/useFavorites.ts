'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/modules/auth/hooks/useSession';
import { listFavoritesRequest } from '../api';

export function useFavorites() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => listFavoritesRequest().then((res) => res.data),
    enabled: isAuthenticated,
  });
}
