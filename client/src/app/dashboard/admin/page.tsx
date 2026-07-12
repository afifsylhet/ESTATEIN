'use client';

import { Building2, Users, Inbox, TrendingUp } from 'lucide-react';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAdminOverview } from '@/modules/stats/hooks/useAdminStats';
import { PropertiesPerMonthChart } from '@/modules/dashboard/components/charts/PropertiesPerMonthChart';
import { InquiriesOverTimeChart } from '@/modules/dashboard/components/charts/InquiriesOverTimeChart';
import { PropertiesByTypeChart } from '@/modules/dashboard/components/charts/PropertiesByTypeChart';

export default function AdminOverviewPage() {
  const { data: overview, isLoading } = useAdminOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Admin Overview</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">A snapshot of what&apos;s happening on Estatein.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label="Total Properties" value={isLoading ? '—' : overview?.totalProperties ?? 0} />
        <StatCard icon={Users} label="Total Users" value={isLoading ? '—' : overview?.totalUsers ?? 0} />
        <StatCard icon={Inbox} label="Total Inquiries" value={isLoading ? '—' : overview?.totalInquiries ?? 0} />
        <StatCard
          icon={TrendingUp}
          label="Sold/Rented This Month"
          value={isLoading ? '—' : overview?.soldOrRentedThisMonth ?? 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Properties Listed Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertiesPerMonthChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inquiries Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <InquiriesOverTimeChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Properties by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertiesByTypeChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

