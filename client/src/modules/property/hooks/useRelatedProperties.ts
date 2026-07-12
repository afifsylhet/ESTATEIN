'use client';

import { useQuery } from '@tanstack/react-query';
import { relatedPropertiesRequest } from '../api';

export function useRelatedProperties(id: string) {
  return useQuery({
    queryKey: ['properties', id, 'related'],
    queryFn: () => relatedPropertiesRequest(id).then((res) => res.data),
    enabled: Boolean(id),
  });
}
