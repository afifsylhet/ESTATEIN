'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/ErrorState';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
