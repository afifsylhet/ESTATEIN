import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, Testimonial } from '@/types';

export function listTestimonialsRequest() {
  return apiClient<ApiSuccess<Testimonial[]>>('/testimonials', { method: 'GET', skipAuth: true });
}

export function adminTestimonialsRequest() {
  return apiClient<ApiSuccess<Testimonial[]>>('/testimonials/admin/all', { method: 'GET' });
}

export function createTestimonialRequest(input: { name: string; role?: string; message: string; rating: number }) {
  return apiClient<ApiSuccess<Testimonial>>('/testimonials', { method: 'POST', body: input, skipAuth: true });
}

export function moderateTestimonialRequest(id: string, isApproved: boolean) {
  return apiClient<ApiSuccess<Testimonial>>(`/testimonials/${id}/moderate`, { method: 'PATCH', body: { isApproved } });
}

export function deleteTestimonialRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/testimonials/${id}`, { method: 'DELETE' });
}
