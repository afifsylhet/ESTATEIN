import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, User } from '@/types';
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from './schema';

type AuthPayload = { user: User; accessToken: string };

export function loginRequest(input: LoginInput) {
  return apiClient<ApiSuccess<AuthPayload>>('/auth/login', {
    method: 'POST',
    body: input,
    skipAuth: true,
  });
}

export function registerRequest(input: RegisterInput) {
  return apiClient<ApiSuccess<AuthPayload>>('/auth/register', {
    method: 'POST',
    body: input,
    skipAuth: true,
  });
}

export function forgotPasswordRequest(input: ForgotPasswordInput) {
  return apiClient<ApiSuccess<null>>('/auth/forgot-password', {
    method: 'POST',
    body: input,
    skipAuth: true,
  });
}

export function resetPasswordRequest(input: { token: string; password: string }) {
  return apiClient<ApiSuccess<null>>('/auth/reset-password', {
    method: 'POST',
    body: input,
    skipAuth: true,
  });
}

export function logoutRequest() {
  return apiClient<ApiSuccess<null>>('/auth/logout', { method: 'POST' });
}

export function meRequest() {
  return apiClient<ApiSuccess<User>>('/auth/me', { method: 'GET' });
}
