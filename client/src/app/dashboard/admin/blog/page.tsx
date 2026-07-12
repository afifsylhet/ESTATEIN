'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import { adminBlogsRequest, deleteBlogRequest } from '@/modules/blog/api';

export default function AdminBlogPage() {
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'blogs', page],
    queryFn: () => adminBlogsRequest({ page: String(page), limit: '10' }),
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => deleteBlogRequest(id),
    onSuccess: () => {
      toast({ title: 'Post deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Blog Posts</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">Publish market insights and guides.</p>
        </div>
        <Link href="/dashboard/admin/blog/new">
          <Button>
            <Plus /> New Post
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-1 font-medium">{blog.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={blog.isPublished ? 'success' : 'muted'}>{blog.isPublished ? 'Published' : 'Draft'}</Badge>
                  </TableCell>
                  <TableCell>{blog.views}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/admin/blog/${blog.slug}/edit`}>
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(blog._id)}>
                        <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this post?"
        confirmLabel="Delete"
        loading={deleteBlog.isPending}
        onConfirm={() => deleteTarget && deleteBlog.mutate(deleteTarget)}
      />
    </div>
  );
}
