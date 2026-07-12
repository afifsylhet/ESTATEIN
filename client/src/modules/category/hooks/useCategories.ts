'use client';

import { useQuery } from '@tanstack/react-query';
import { listCategoriesRequest } from '../api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategoriesRequest().then((res) => res.data),
  });
}
