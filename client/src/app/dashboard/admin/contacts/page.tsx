'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';
import { adminContactsRequest, updateContactStatusRequest } from '@/modules/contact/api';
import type { ContactSubmission } from '@/types';

export default function AdminContactsPage() {
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'contacts', page],
    queryFn: () => adminContactsRequest({ page: String(page) }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactSubmission['status'] }) => updateContactStatusRequest(id, status),
    onSuccess: () => {
      toast({ title: 'Status updated', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Contact Messages</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Messages submitted through the Contact Us page.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{contact.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[160px]">
                    <p className="line-clamp-1">{contact.subject}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm">{contact.message}</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={contact.status}
                      onValueChange={(status) =>
                        updateStatus.mutate({ id: contact._id, status: status as ContactSubmission['status'] })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
