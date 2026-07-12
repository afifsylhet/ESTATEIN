'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { listCategoriesRequest, createCategoryRequest, deleteCategoryRequest } from '@/modules/category/api';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategoriesRequest().then((res) => res.data),
  });

  const createCategory = useMutation({
    mutationFn: () => createCategoryRequest({ name, description: description || undefined }),
    onSuccess: () => {
      toast({ title: 'Category created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setDescription('');
      setDialogOpen(false);
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not create category.';
      toast({ title: 'Failed', description: message, variant: 'error' });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => deleteCategoryRequest(id),
    onSuccess: () => {
      toast({ title: 'Category deleted', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteTarget(null);
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not delete category.';
      toast({ title: 'Failed', description: message, variant: 'error' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">Organize properties into browsable categories.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCategory.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="cat-name">Name</Label>
                <Input id="cat-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-desc">Description (optional)</Label>
                <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" loading={createCategory.isPending}>
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Tags} title="No categories yet" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.propertyCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(category._id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this category?"
        description="Categories with existing properties can't be deleted. Reassign those listings first."
        confirmLabel="Delete"
        loading={deleteCategory.isPending}
        onConfirm={() => deleteTarget && deleteCategory.mutate(deleteTarget)}
      />
    </div>
  );
}
