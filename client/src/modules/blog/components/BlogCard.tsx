import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { Blog } from '@/types';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--muted)]">
        <Image
          loader={cloudinaryLoader}
          src={blog.coverImage.url}
          alt={blog.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <p className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(blog.createdAt)}
        </p>
        <h3 className="font-display text-lg font-semibold group-hover:text-[var(--color-primary)]">{blog.title}</h3>
        <p className="text-sm text-[var(--muted-foreground)]">{truncate(blog.excerpt, 120)}</p>
      </div>
    </Link>
  );
}
