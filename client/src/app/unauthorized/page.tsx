import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="h-12 w-12 text-[var(--color-destructive)]" />
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="max-w-md text-[var(--muted-foreground)]">
        You don&apos;t have permission to view this page. If you believe this is a mistake, please contact support.
      </p>
      <Link href="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
