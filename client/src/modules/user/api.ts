import { apiClient, buildQueryString } from '@/lib/api-client';
import type { ApiSuccess, PaginationMeta, User } from '@/types';

export function updateProfileRequest(id: string, input: { name?: string; phone?: string }) {
  return apiClient<ApiSuccess<User>>(`/users/${id}`, { method: 'PATCH', body: input });
}

export function updateAvatarRequest(id: string, formData: FormData) {
  return apiClient<ApiSuccess<User>>(`/users/${id}/avatar`, { method: 'PATCH', body: formData, isFormData: true });
}

export function updatePasswordRequest(
  id: string,
  input: { currentPassword: string; newPassword: string; confirmPassword: string }
) {
  return apiClient<ApiSuccess<null>>(`/users/${id}/password`, { method: 'PATCH', body: input });
}

export function adminUsersRequest(filters: { page?: string; role?: string; search?: string } = {}) {
  return apiClient<ApiSuccess<User[]> & { meta: PaginationMeta }>(`/users${buildQueryString(filters)}`, {
    method: 'GET',
  });
}

export function deleteUserRequest(id: string) {
  return apiClient<ApiSuccess<null>>(`/users/${id}`, { method: 'DELETE' });
}
