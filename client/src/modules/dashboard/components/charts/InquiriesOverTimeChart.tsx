'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useInquiriesOverTime } from '@/modules/stats/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

export function InquiriesOverTimeChart() {
  const { data, isLoading } = useInquiriesOverTime();

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  const chartData = (data ?? []).map((d) => ({
    name: `${d._id.month}/${d._id.day}`,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'var(--border)' }} />
        <Line type="monotone" dataKey="count" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
