'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Inbox, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import { adminInquiriesRequest, updateInquiryStatusRequest, deleteInquiryRequest } from '@/modules/inquiry/api';
import type { Inquiry, Property } from '@/types';

export default function AdminInquiriesPage() {
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'inquiries', page],
    queryFn: () => adminInquiriesRequest({ page: String(page), limit: '10' }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inquiry['status'] }) => updateInquiryStatusRequest(id, status),
    onSuccess: () => {
      toast({ title: 'Status updated', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
    },
  });

  const deleteInquiry = useMutation({
    mutationFn: (id: string) => deleteInquiryRequest(id),
    onSuccess: () => {
      toast({ title: 'Inquiry deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Inquiries</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Leads submitted through property pages.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState icon={Inbox} title="No inquiries yet" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((inquiry) => {
                const property = typeof inquiry.property === 'object' ? (inquiry.property as Property) : null;
                return (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{inquiry.email}</p>
                    </TableCell>
                    <TableCell>
                      {property ? (
                        <Link href={`/properties/${property.slug}`} target="_blank" className="text-[var(--color-accent)] hover:underline">
                          {property.title}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 text-sm">{inquiry.message}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        onValueChange={(status) => updateStatus.mutate({ id: inquiry._id, status: status as Inquiry['status'] })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => deleteInquiry.mutate(inquiry._id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
