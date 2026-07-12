'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { adminTestimonialsRequest, moderateTestimonialRequest, deleteTestimonialRequest } from '@/modules/testimonial/api';

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => adminTestimonialsRequest().then((res) => res.data),
  });

  const moderate = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) => moderateTestimonialRequest(id, isApproved),
    onSuccess: () => {
      toast({ title: 'Testimonial updated', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTestimonialRequest(id),
    onSuccess: () => {
      toast({ title: 'Testimonial deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Testimonials</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Review and approve testimonials before they go live.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Star} title="No testimonials yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t._id}>
                <TableCell>
                  <p className="font-medium">{t.name}</p>
                  {t.role && <p className="text-xs text-[var(--muted-foreground)]">{t.role}</p>}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm">{t.message}</p>
                </TableCell>
                <TableCell>{t.rating} / 5</TableCell>
                <TableCell>
                  <Badge variant={t.isApproved ? 'success' : 'warning'}>{t.isApproved ? 'Approved' : 'Pending'}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {!t.isApproved && (
                      <Button variant="ghost" size="icon" aria-label="Approve" onClick={() => moderate.mutate({ id: t._id, isApproved: true })}>
                        <Check className="h-4 w-4 text-[var(--color-success)]" />
                      </Button>
                    )}
                    {t.isApproved && (
                      <Button variant="ghost" size="icon" aria-label="Unapprove" onClick={() => moderate.mutate({ id: t._id, isApproved: false })}>
                        <X className="h-4 w-4 text-[var(--color-warning)]" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove.mutate(t._id)}>
                      <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
