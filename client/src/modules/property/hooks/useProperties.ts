'use client';

import { useQuery } from '@tanstack/react-query';
import { listPropertiesRequest, type PropertyFilters } from '../api';

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => listPropertiesRequest(filters),
    placeholderData: (prev) => prev,
  });
}
