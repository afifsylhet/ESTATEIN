'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyBySlugRequest } from '@/modules/property/api';
import { PropertyForm } from '@/modules/property/components/PropertyForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/ErrorState';

export default function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['properties', slug],
    queryFn: () => propertyBySlugRequest(slug).then((res) => res.data),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Property</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Update the listing details below.</p>
      <div className="mt-8 max-w-3xl">
        {isLoading && <Skeleton className="h-96 w-full" />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {data && <PropertyForm property={data} />}
      </div>
    </div>
  );
}
