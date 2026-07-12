import type { Metadata } from 'next';
import Image from 'next/image';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata: Metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div>
      <section className="container-app py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-semibold">Real estate, made human again</h1>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Estatein started with a simple frustration: finding a home online shouldn&apos;t feel like wading
              through outdated listings and unresponsive agents. We built a platform where every listing is verified,
              every inquiry gets a real reply, and every step — from search to signing — is transparent.
            </p>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Today, our team works with buyers, renters, and property owners across dozens of cities, combining
              local expertise with a modern, easy-to-use platform.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"
              alt="Modern living room"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Stats />

      <section className="container-app py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold">Our values</h2>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">Transparency</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Clear pricing, honest photos, and no hidden fees — ever.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Responsiveness</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Every inquiry gets a reply from a real person, usually within a day.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Local expertise</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Our listings are backed by agents who know the neighborhoods, not just the numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
