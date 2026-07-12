'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/shared/SearchBar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { toast } from '@/components/ui/toast';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/utils';
import { adminUsersRequest, deleteUserRequest } from '@/modules/user/api';

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', debouncedSearch, page],
    queryFn: () => adminUsersRequest({ search: debouncedSearch || undefined, page: String(page) }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: () => {
      toast({ title: 'User deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Everyone registered on Estatein.</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" className="max-w-sm" />

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {user.role !== 'admin' && (
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(user.id)}>
                        <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                      </Button>
                    )}
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
        title="Delete this user?"
        description="This permanently removes their account, favorites, and reviews."
        confirmLabel="Delete"
        loading={deleteUser.isPending}
        onConfirm={() => deleteTarget && deleteUser.mutate(deleteTarget)}
      />
    </div>
  );
}
