import Link from 'next/link';
import { Building, Home, TreePine, Landmark, Warehouse, Briefcase, LayoutGrid } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import type { ApiSuccess, Category } from '@/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  apartment: Building,
  house: Home,
  villa: Landmark,
  land: TreePine,
  commercial: Warehouse,
  office: Briefcase,
};

export async function Categories() {
  let categories: Category[] = [];
  try {
    const res = await serverFetch<ApiSuccess<Category[]>>('/categories', { tags: ['categories'] });
    categories = res.data.slice(0, 6);
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  return (
    <section className="container-app py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold">Browse by Category</h2>
          <p className="mt-1 text-[var(--muted-foreground)]">Find exactly the kind of place you&apos;re looking for.</p>
        </div>
        <Link href="/properties" className="hidden text-sm font-medium text-[var(--color-accent)] hover:underline sm:block">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = ICONS[category.slug] ?? LayoutGrid;
          return (
            <Link
              key={category._id}
              href={`/properties?category=${category._id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] p-6 text-center transition-colors hover:border-[var(--color-primary)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-[var(--muted-foreground)]">{category.propertyCount} listings</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
