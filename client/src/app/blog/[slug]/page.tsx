import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import { formatDate, initials } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { ApiSuccess, Blog } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await serverFetch<ApiSuccess<Blog>>(`/blogs/${slug}`, { revalidate: 60 });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: 'Post Not Found' };
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: { title: blog.title, description: blog.excerpt, images: [blog.coverImage.url] },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <article className="container-app max-w-3xl py-16">
      <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <CalendarDays className="h-4 w-4" /> {formatDate(blog.createdAt)}
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold">{blog.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--muted)] text-xs font-semibold">
          {blog.author.avatar?.url ? (
            <Image loader={cloudinaryLoader} src={blog.author.avatar.url} alt={blog.author.name} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            initials(blog.author.name)
          )}
        </div>
        <span className="text-sm font-medium">{blog.author.name}</span>
      </div>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image loader={cloudinaryLoader} src={blog.coverImage.url} alt={blog.title} fill priority className="object-cover" />
      </div>

      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-[var(--foreground)]/90">
        {blog.content}
      </div>

      {blog.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
