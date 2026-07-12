import type { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import { BlogGrid } from '@/modules/blog/components/BlogGrid';
import type { ApiSuccess, Blog } from '@/types';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogPage() {
  let blogs: Blog[] = [];
  try {
    const res = await serverFetch<ApiSuccess<Blog[]>>('/blogs?limit=24', { tags: ['blogs'] });
    blogs = res.data;
  } catch {
    blogs = [];
  }

  return (
    <div className="container-app py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold">The Estatein Blog</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Market insights, buying guides, and tips for renters and owners.</p>
      </div>
      <div className="mt-10">
        <BlogGrid blogs={blogs} />
      </div>
    </div>
  );
}
