'use client';

import { Button } from '@/components/ui/button';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { useLogin } from '../hooks/useLogin';

export function DemoLoginButtons() {
  const login = useLogin();

  return (
    <div className="space-y-2">
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-[var(--border)]" />
        <span className="mx-3 shrink-0 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          or try a demo account
        </span>
        <div className="flex-grow border-t border-[var(--border)]" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => login.mutate(DEMO_CREDENTIALS.user)}
          disabled={login.isPending}
        >
          Demo User
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => login.mutate(DEMO_CREDENTIALS.admin)}
          disabled={login.isPending}
        >
          Demo Admin
        </Button>
      </div>
    </div>
  );
}
