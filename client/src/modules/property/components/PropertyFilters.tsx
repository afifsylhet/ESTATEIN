'use client';

import * as React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useDebounce } from '@/hooks/useDebounce';
import { PROPERTY_TYPES, PROPERTY_PURPOSES, SORT_OPTIONS } from '@/lib/constants';

export function PropertyFilters() {
  const { get, set } = useQueryParams();
  const [showMore, setShowMore] = React.useState(false);
  const [search, setSearch] = React.useState(get('search'));
  const debouncedSearch = useDebounce(search, 400);

  React.useEffect(() => {
    if (debouncedSearch !== get('search')) {
      set({ search: debouncedSearch || undefined, page: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const activeFilterCount = ['purpose', 'type', 'city', 'minPrice', 'maxPrice', 'bedrooms'].filter((k) => get(k)).length;

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} className="flex-1" />

        <Select value={get('purpose') || 'all'} onValueChange={(v) => set({ purpose: v === 'all' ? undefined : v, page: undefined })}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any purpose</SelectItem>
            {PROPERTY_PURPOSES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={get('sort') || 'newest'} onValueChange={(v) => set({ sort: v === 'newest' ? undefined : v })}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setShowMore((v) => !v)} className="shrink-0">
          <SlidersHorizontal /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {showMore && (
        <div className="grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={get('type') || 'all'} onValueChange={(v) => set({ type: v === 'all' ? undefined : v, page: undefined })}>
            <SelectTrigger>
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any type</SelectItem>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="City"
            defaultValue={get('city')}
            onBlur={(e) => set({ city: e.target.value || undefined, page: undefined })}
          />
          <Input
            type="number"
            placeholder="Min price"
            defaultValue={get('minPrice')}
            onBlur={(e) => set({ minPrice: e.target.value || undefined, page: undefined })}
          />
          <Input
            type="number"
            placeholder="Max price"
            defaultValue={get('maxPrice')}
            onBlur={(e) => set({ maxPrice: e.target.value || undefined, page: undefined })}
          />
          <Input
            type="number"
            placeholder="Min bedrooms"
            defaultValue={get('bedrooms')}
            onBlur={(e) => set({ bedrooms: e.target.value || undefined, page: undefined })}
          />
        </div>
      )}

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              set({ purpose: undefined, type: undefined, city: undefined, minPrice: undefined, maxPrice: undefined, bedrooms: undefined, page: undefined })
            }
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
