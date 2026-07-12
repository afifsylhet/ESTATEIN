import { apiClient } from '@/lib/api-client';
import type { ApiSuccess } from '@/types';

export function subscribeRequest(email: string) {
  return apiClient<ApiSuccess<{ email: string }>>('/newsletter/subscribe', {
    method: 'POST',
    body: { email },
    skipAuth: true,
  });
}
