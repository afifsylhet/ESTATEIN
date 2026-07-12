import Link from 'next/link';
import { serverFetch } from '@/lib/server-fetch';
import { PropertyCard } from '@/modules/property/components/PropertyCard';
import type { ApiSuccess, Property } from '@/types';

export async function FeaturedProperties() {
  let properties: Property[] = [];
  try {
    const res = await serverFetch<ApiSuccess<Property[]>>('/properties/featured', { tags: ['properties'] });
    properties = res.data;
  } catch {
    properties = [];
  }

  if (properties.length === 0) return null;

  return (
    <section className="container-app py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold">Featured Properties</h2>
          <p className="mt-1 text-[var(--muted-foreground)]">Hand-picked listings our team thinks you&apos;ll love.</p>
        </div>
        <Link href="/properties" className="hidden text-sm font-medium text-[var(--color-accent)] hover:underline sm:block">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </section>
  );
}
