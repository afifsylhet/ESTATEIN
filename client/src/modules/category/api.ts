import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, Category } from '@/types';

export function listCategoriesRequest() {
  return apiClient<ApiSuccess<Category[]>>('/categories', { method: 'GET', skipAuth: true });
}

export function createCategoryRequest(input: { name: string; icon?: string; description?: string }) {
  return apiClient<ApiSuccess<Category>>('/categories', { method: 'POST', body: input });
}

export function updateCategoryRequest(id: string, input: Partial<{ name: string; icon: string; description: string }>) {
  return apiClient<ApiSuccess<Category>>(`/categories/${id}`, { method: 'PATCH', body: input });
}

export function deleteCategoryRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/categories/${id}`, { method: 'DELETE' });
}
