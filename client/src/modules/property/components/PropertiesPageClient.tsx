'use client';

import { useQueryParams } from '@/hooks/useQueryParams';
import { useProperties } from '../hooks/useProperties';
import { PropertyFilters } from './PropertyFilters';
import { PropertyGrid } from './PropertyGrid';
import { Pagination } from '@/components/shared/Pagination';
import { ErrorState } from '@/components/shared/ErrorState';

export function PropertiesPageClient() {
  const { get, set } = useQueryParams();

  const filters = {
    search: get('search') || undefined,
    purpose: get('purpose') || undefined,
    type: get('type') || undefined,
    category: get('category') || undefined,
    city: get('city') || undefined,
    minPrice: get('minPrice') || undefined,
    maxPrice: get('maxPrice') || undefined,
    bedrooms: get('bedrooms') || undefined,
    sort: get('sort') || undefined,
    page: get('page') || '1',
    limit: '12',
  };

  const { data, isLoading, isError, refetch } = useProperties(filters);

  return (
    <div className="container-app space-y-6 py-10">
      <div>
        <h1 className="font-display text-3xl font-semibold">Explore Properties</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          {data?.meta ? `${data.meta.total} properties found` : 'Browse our full catalog of listings'}
        </p>
      </div>

      <PropertyFilters />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <PropertyGrid properties={data?.data} isLoading={isLoading} />
          {data?.meta && (
            <Pagination
              meta={data.meta}
              onPageChange={(page) => set({ page: String(page) })}
            />
          )}
        </>
      )}
    </div>
  );
}
