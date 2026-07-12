import { Newspaper } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Blog } from '@/types';

export function BlogGrid({ blogs, isLoading }: { blogs?: Blog[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return <EmptyState icon={Newspaper} title="No articles yet" description="Check back soon for market insights and guides." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}
