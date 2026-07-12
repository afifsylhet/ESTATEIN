import 'server-only';
import { cookies } from 'next/headers';
import type { ApiSuccess, User } from '@/types';

// Server-only helpers call the backend origin directly (the `/api/v1` proxy is
// browser-only). BACKEND_ORIGIN is the same value used by next.config rewrites.
const API_URL = `${process.env.BACKEND_ORIGIN ?? 'http://localhost:5000'}/api/v1`;

export interface ServerSession {
  user: User;
  accessToken: string;
}

/**
 * Server-only helper used in Server Components / layouts to resolve the current session.
 * Forwards the httpOnly refresh-token cookie to the API's /auth/refresh endpoint, which
 * issues a fresh short-lived access token. Returns null when the visitor is logged out.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiSuccess<{ user: User; accessToken: string }>;
    return { user: json.data.user, accessToken: json.data.accessToken };
  } catch {
    return null;
  }
}

/** Authenticated server-side fetch — attaches the Bearer token resolved above. */
export async function serverApiFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json?.message ?? 'Request failed');
  }
  return json as T;
}
