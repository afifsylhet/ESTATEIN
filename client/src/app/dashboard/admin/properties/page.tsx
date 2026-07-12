'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/shared/SearchBar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useProperties } from '@/modules/property/hooks/useProperties';
import { useDeleteProperty } from '@/modules/property/hooks/usePropertyMutations';
import { formatPrice } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { Building2 } from 'lucide-react';

const STATUS_VARIANT = { available: 'success', pending: 'warning', sold: 'muted', rented: 'muted' } as const;

export default function AdminPropertiesPage() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const deleteProperty = useDeleteProperty();

  const { data, isLoading } = useProperties({ search: debouncedSearch || undefined, page: String(page), limit: '10' });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Properties</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">Manage every listing on the platform.</p>
        </div>
        <Link href="/dashboard/admin/properties/new">
          <Button>
            <Plus /> New Property
          </Button>
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} className="max-w-sm" />

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState icon={Building2} title="No properties found" />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                        {property.images[0] && (
                          <Image loader={cloudinaryLoader} src={property.images[0].url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{property.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{property.location.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(property.price, property.priceUnit)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[property.status]} className="capitalize">
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.views}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/properties/${property.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/admin/properties/${property.slug}/edit`}>
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(property._id)}>
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
        title="Delete this property?"
        description="This will permanently remove the listing and its images. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteProperty.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteProperty.mutate(deleteTarget, { onSuccess: () => setDeleteTarget(null) });
        }}
      />
    </div>
  );
}
