import { apiClient, buildQueryString } from '@/lib/api-client';
import type { ApiSuccess, Blog, PaginationMeta } from '@/types';

export function listBlogsRequest(filters: { page?: string; limit?: string } = {}) {
  return apiClient<ApiSuccess<Blog[]> & { meta: PaginationMeta }>(`/blogs${buildQueryString(filters)}`, {
    method: 'GET',
    skipAuth: true,
  });
}

export function latestBlogsRequest() {
  return apiClient<ApiSuccess<Blog[]>>('/blogs/latest', { method: 'GET', skipAuth: true });
}

export function blogBySlugRequest(slug: string) {
  return apiClient<ApiSuccess<Blog>>(`/blogs/${slug}`, { method: 'GET', skipAuth: true });
}

export function adminBlogsRequest(filters: { page?: string; limit?: string } = {}) {
  return apiClient<ApiSuccess<Blog[]> & { meta: PaginationMeta }>(`/blogs/admin/all${buildQueryString(filters)}`, {
    method: 'GET',
  });
}

export function createBlogRequest(formData: FormData) {
  return apiClient<ApiSuccess<Blog>>('/blogs', { method: 'POST', body: formData, isFormData: true });
}

export function updateBlogRequest(id: string, formData: FormData) {
  return apiClient<ApiSuccess<Blog>>(`/blogs/${id}`, { method: 'PATCH', body: formData, isFormData: true });
}

export function deleteBlogRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/blogs/${id}`, { method: 'DELETE' });
}
