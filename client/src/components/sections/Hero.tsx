import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="container-app relative z-10 flex min-h-[560px] flex-col items-start justify-center gap-6 py-24">
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
          Trusted by 12,000+ home seekers
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Find your perfect place to call home
        </h1>
        <p className="max-w-xl text-lg text-white/85">
          Curated listings, transparent pricing, and a team that actually answers the phone. Buy, rent, or sell with confidence.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/properties">
            <Button size="lg" variant="secondary">
              <Search /> Browse Properties
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              Get Started <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
