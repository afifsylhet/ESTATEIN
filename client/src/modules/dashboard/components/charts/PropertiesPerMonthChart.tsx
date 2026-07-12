'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usePropertiesPerMonth } from '@/modules/stats/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PropertiesPerMonthChart() {
  const { data, isLoading } = usePropertiesPerMonth();

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  const chartData = (data ?? []).map((d) => ({
    name: `${MONTH_LABELS[d._id.month - 1]} ${d._id.year}`,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'var(--border)' }} />
        <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
