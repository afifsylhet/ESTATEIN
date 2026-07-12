import { apiClient, buildQueryString } from '@/lib/api-client';
import type { ApiSuccess, Inquiry, PaginationMeta } from '@/types';

export function createInquiryRequest(input: { property: string; name: string; email: string; phone?: string; message: string }) {
  return apiClient<ApiSuccess<Inquiry>>('/inquiries', { method: 'POST', body: input, skipAuth: true });
}

export function myInquiriesRequest() {
  return apiClient<ApiSuccess<Inquiry[]>>('/inquiries/me', { method: 'GET' });
}

export function adminInquiriesRequest(filters: { status?: string; page?: string; limit?: string } = {}) {
  return apiClient<ApiSuccess<Inquiry[]> & { meta: PaginationMeta }>(`/inquiries${buildQueryString(filters)}`, { method: 'GET' });
}

export function updateInquiryStatusRequest(id: string, status: Inquiry['status']) {
  return apiClient<ApiSuccess<Inquiry>>(`/inquiries/${id}/status`, { method: 'PATCH', body: { status } });
}

export function deleteInquiryRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/inquiries/${id}`, { method: 'DELETE' });
}
