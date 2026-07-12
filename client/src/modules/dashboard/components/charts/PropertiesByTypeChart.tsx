'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePropertiesByType } from '@/modules/stats/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0f5132', '#c9a24b', '#2563eb', '#dc2626', '#d97706', '#16a34a'];

export function PropertiesByTypeChart() {
  const { data, isLoading } = usePropertiesByType();

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  const chartData = (data ?? []).map((d) => ({ name: d._id, value: d.count }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'var(--border)' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
