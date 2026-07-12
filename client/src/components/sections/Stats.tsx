import { Building2, MapPin, Users, Star } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import type { ApiSuccess, HomepageStats } from '@/types';

export async function Stats() {
  let stats: HomepageStats | null = null;
  try {
    const res = await serverFetch<ApiSuccess<HomepageStats>>('/stats/homepage', { tags: ['stats'] });
    stats = res.data;
  } catch {
    stats = null;
  }

  const items = [
    { icon: Building2, label: 'Properties Listed', value: stats?.totalProperties ?? '—' },
    { icon: MapPin, label: 'Cities Covered', value: stats?.citiesCovered ?? '—' },
    { icon: Users, label: 'Happy Clients', value: stats?.happyClients ?? '—' },
    { icon: Star, label: 'Average Rating', value: stats ? stats.averageRating.toFixed(1) : '—' },
  ];

  return (
    <section className="border-y border-[var(--border)] bg-[var(--muted)]/40">
      <div className="container-app grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <item.icon className="h-6 w-6 text-[var(--color-primary)]" />
            <span className="font-display text-2xl font-semibold sm:text-3xl">{item.value}</span>
            <span className="text-sm text-[var(--muted-foreground)]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
