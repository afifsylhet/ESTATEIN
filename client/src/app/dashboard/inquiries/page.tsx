'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { myInquiriesRequest } from '@/modules/inquiry/api';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { Property } from '@/types';

const STATUS_VARIANT = { new: 'warning', contacted: 'success', closed: 'muted' } as const;

export default function MyInquiriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['inquiries', 'me'],
    queryFn: () => myInquiriesRequest().then((res) => res.data),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">My Inquiries</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Track the inquiries you&apos;ve sent to agents.</p>

      <div className="mt-8 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!isLoading && (!data || data.length === 0) && (
          <EmptyState icon={MessageSquare} title="No inquiries yet" description="Reach out about a property you're interested in." />
        )}

        {data?.map((inquiry) => {
          const property = typeof inquiry.property === 'object' ? (inquiry.property as Property) : null;
          return (
            <div key={inquiry._id} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
              <div className="min-w-0">
                {property ? (
                  <Link href={`/properties/${property.slug}`} className="font-medium hover:text-[var(--color-primary)]">
                    {property.title}
                  </Link>
                ) : (
                  <span className="font-medium">Property inquiry</span>
                )}
                <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">{inquiry.message}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{formatDate(inquiry.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[inquiry.status]} className="shrink-0 capitalize">
                {inquiry.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
