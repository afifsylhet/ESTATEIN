'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/modules/favorite/hooks/useFavorites';
import { PropertyGrid } from '@/modules/property/components/PropertyGrid';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites();
  const properties = data?.map((f) => f.property);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Favorites</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Properties you&apos;ve saved for later.</p>
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <PropertyGrid properties={properties} />
        ) : (
          <EmptyState icon={Heart} title="No favorites yet" description="Start browsing and tap the heart icon to save properties here." />
        )}
      </div>
    </div>
  );
}
