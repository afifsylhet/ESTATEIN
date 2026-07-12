import { apiClient, buildQueryString } from '@/lib/api-client';
import type { ApiSuccess, ContactSubmission, PaginationMeta } from '@/types';

export function submitContactRequest(input: { name: string; email: string; subject: string; message: string }) {
  return apiClient<ApiSuccess<ContactSubmission>>('/contact', { method: 'POST', body: input, skipAuth: true });
}

export function adminContactsRequest(filters: { status?: string; page?: string } = {}) {
  return apiClient<ApiSuccess<ContactSubmission[]> & { meta: PaginationMeta }>(`/contact${buildQueryString(filters)}`, {
    method: 'GET',
  });
}

export function updateContactStatusRequest(id: string, status: ContactSubmission['status']) {
  return apiClient<ApiSuccess<ContactSubmission>>(`/contact/${id}/status`, { method: 'PATCH', body: { status } });
}
