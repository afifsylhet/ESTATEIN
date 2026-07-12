import { apiClient, buildQueryString } from '@/lib/api-client';
import type { ApiSuccess, Property } from '@/types';

export interface PropertyFilters {
  [key: string]: string | undefined;
  search?: string;
  purpose?: string;
  type?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  status?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export function listPropertiesRequest(filters: PropertyFilters = {}) {
  return apiClient<ApiSuccess<Property[]>>(`/properties${buildQueryString(filters)}`, {
    method: 'GET',
    skipAuth: true,
  });
}

export function featuredPropertiesRequest() {
  return apiClient<ApiSuccess<Property[]>>('/properties/featured', { method: 'GET', skipAuth: true });
}

export function propertyBySlugRequest(slug: string) {
  return apiClient<ApiSuccess<Property>>(`/properties/${slug}`, { method: 'GET', skipAuth: true });
}

export function relatedPropertiesRequest(id: string) {
  return apiClient<ApiSuccess<Property[]>>(`/properties/${id}/related`, { method: 'GET', skipAuth: true });
}

export function createPropertyRequest(formData: FormData) {
  return apiClient<ApiSuccess<Property>>('/properties', { method: 'POST', body: formData, isFormData: true });
}

export function updatePropertyRequest(id: string, formData: FormData) {
  return apiClient<ApiSuccess<Property>>(`/properties/${id}`, { method: 'PATCH', body: formData, isFormData: true });
}

export function deletePropertyRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/properties/${id}`, { method: 'DELETE' });
}
