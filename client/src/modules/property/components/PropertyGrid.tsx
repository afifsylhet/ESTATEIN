import { Home } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './PropertyCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Property } from '@/types';

interface PropertyGridProps {
  properties?: Property[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function PropertyGrid({
  properties,
  isLoading,
  emptyTitle = 'No properties found',
  emptyDescription = 'Try adjusting your filters or search terms.',
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return <EmptyState icon={Home} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
