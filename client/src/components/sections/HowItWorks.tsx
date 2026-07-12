import { Search, CalendarCheck, KeyRound } from 'lucide-react';

const STEPS = [
  { icon: Search, title: 'Search & Discover', description: 'Filter by location, price, and type to find properties that fit your needs.' },
  { icon: CalendarCheck, title: 'Schedule & Visit', description: 'Send an inquiry, connect with our team, and book a viewing at your convenience.' },
  { icon: KeyRound, title: 'Close & Move In', description: 'Finalize the paperwork with our support and get the keys to your new place.' },
];

export function HowItWorks() {
  return (
    <section className="bg-[var(--muted)]/40 py-16">
      <div className="container-app">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold">How It Works</h2>
          <p className="mt-1 text-[var(--muted-foreground)]">Three simple steps to your next home.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
              <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
                {idx + 1}
              </span>
              <step.icon className="mx-auto mt-4 h-8 w-8 text-[var(--color-primary)]" />
              <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
