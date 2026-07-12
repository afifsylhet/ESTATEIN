import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-display text-6xl font-semibold text-[var(--color-primary)]">404</span>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-[var(--muted-foreground)]">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
