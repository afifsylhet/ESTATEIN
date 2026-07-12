import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, Review } from '@/types';

export function listReviewsRequest(propertyId: string) {
  return apiClient<ApiSuccess<Review[]>>(`/reviews/property/${propertyId}`, { method: 'GET', skipAuth: true });
}

export function createReviewRequest(input: { property: string; rating: number; comment: string }) {
  return apiClient<ApiSuccess<Review>>('/reviews', { method: 'POST', body: input });
}

export function deleteReviewRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/reviews/${id}`, { method: 'DELETE' });
}
