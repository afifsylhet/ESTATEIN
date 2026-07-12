import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart, MessageSquare, Star } from 'lucide-react';
import { getServerSession, serverApiFetch } from '@/lib/auth';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { Button } from '@/components/ui/button';
import type { ApiSuccess } from '@/types';
import type { UserOverviewStats } from '@/modules/stats/api';

export default async function DashboardOverviewPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');
  if (session.user.role === 'admin') redirect('/dashboard/admin');

  let stats: UserOverviewStats = { favoritesCount: 0, inquiriesCount: 0, reviewsCount: 0 };
  try {
    const res = await serverApiFetch<ApiSuccess<UserOverviewStats>>('/stats/dashboard/user', session.accessToken);
    stats = res.data;
  } catch {
    // keep defaults — dashboard still renders with zeroed stats rather than erroring out
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back, {session.user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Here&apos;s a quick look at your account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Heart} label="Saved Properties" value={stats.favoritesCount} />
        <StatCard icon={MessageSquare} label="Inquiries Sent" value={stats.inquiriesCount} />
        <StatCard icon={Star} label="Reviews Written" value={stats.reviewsCount} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/properties">
          <Button>Browse Properties</Button>
        </Link>
        <Link href="/dashboard/favorites">
          <Button variant="outline">View Favorites</Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}
