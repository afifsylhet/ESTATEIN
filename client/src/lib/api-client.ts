'use client';

import { useAuthStore } from '@/store/auth-store';
import type { ApiFailure, ApiSuccess } from '@/types';

// In production, default to same-origin so browser requests flow through Next rewrites.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  isFormData?: boolean;
  skipAuth?: boolean;
  retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const json = (await res.json()) as ApiSuccess<{ accessToken: string; user: unknown }>;
        useAuthStore.getState().setAccessToken(json.data.accessToken);
        return json.data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/** Client-side fetch wrapper: injects the access token, retries once on 401 via refresh cookie. */
export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, isFormData, skipAuth, retry = true, headers, ...rest } = options;
  const token = useAuthStore.getState().accessToken;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
    body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
  });

  if (res.status === 401 && !skipAuth && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiClient<T>(path, { ...options, retry: false });
    }
    useAuthStore.getState().clearSession();
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const failure = json as ApiFailure | null;
    throw new ApiClientError(res.status, failure?.message ?? 'Something went wrong', failure?.errors);
  }

  return json as T;
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
