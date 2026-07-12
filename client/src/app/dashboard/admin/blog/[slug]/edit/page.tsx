'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogBySlugRequest } from '@/modules/blog/api';
import { BlogForm } from '@/modules/blog/components/BlogForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

export default function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => blogBySlugRequest(slug).then((res) => res.data),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Blog Post</h1>
      <div className="mt-8 max-w-3xl">
        {isLoading && <Skeleton className="h-96 w-full" />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {data && <BlogForm blog={data} />}
      </div>
    </div>
  );
}
