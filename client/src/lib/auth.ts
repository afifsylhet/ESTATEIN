import 'server-only';
import { cookies } from 'next/headers';
import type { ApiSuccess, User } from '@/types';

function getApiUrl(): string {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (explicitSiteUrl) return `${explicitSiteUrl}/api/v1`;

  const vercelUrl = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercelUrl) return `https://${vercelUrl}/api/v1`;

  return 'http://localhost:3000/api/v1';
}

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
  const API_URL = getApiUrl();
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
  const API_URL = getApiUrl();
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
