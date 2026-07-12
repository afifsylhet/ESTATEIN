'use client';

import { useQuery } from '@tanstack/react-query';
import { featuredPropertiesRequest } from '../api';

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => featuredPropertiesRequest().then((res) => res.data),
  });
}
