import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="container-app py-16">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 px-6 py-14 text-center">
        <h2 className="font-display text-3xl font-semibold">Ready to find your next place?</h2>
        <p className="max-w-xl text-[var(--muted-foreground)]">
          Create a free account to save favorites, track inquiries, and get notified the moment a matching property goes live.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register">
            <Button size="lg">
              Become a Member <ArrowRight />
            </Button>
          </Link>
          <Link href="/properties">
            <Button size="lg" variant="outline">
              Explore Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
