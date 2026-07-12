import type { ApiSuccess } from '@/types';

// Server Components run on the server and cannot use the browser's relative
// `/api/v1` proxy path, so they call the backend origin directly.
const API_URL = `${process.env.BACKEND_ORIGIN ?? 'http://localhost:5000'}/api/v1`;

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Public, unauthenticated server-side fetch used by Server Components for the
 * server-first rendering rule (§8.1). Supports Next.js cache tags so admin
 * mutations can call revalidateTag()/revalidatePath() to refresh public pages.
 */
export async function serverFetch<T>(path: string, { revalidate = 60, tags = [] }: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate, tags },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Failed to fetch ${path}`);
  }

  return json as T;
}

export type { ApiSuccess };
