import Link from 'next/link';
import { serverFetch } from '@/lib/server-fetch';
import { BlogCard } from '@/modules/blog/components/BlogCard';
import type { ApiSuccess, Blog } from '@/types';

export async function BlogPreview() {
  let blogs: Blog[] = [];
  try {
    const res = await serverFetch<ApiSuccess<Blog[]>>('/blogs/latest', { tags: ['blogs'] });
    blogs = res.data;
  } catch {
    blogs = [];
  }

  if (blogs.length === 0) return null;

  return (
    <section className="container-app py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold">From the Blog</h2>
          <p className="mt-1 text-[var(--muted-foreground)]">Market insights, guides, and tips for buyers and renters.</p>
        </div>
        <Link href="/blog" className="hidden text-sm font-medium text-[var(--color-accent)] hover:underline sm:block">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
