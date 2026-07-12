import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
          {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
