import type { Metadata } from 'next';
import Link from 'next/link';
import { LifeBuoy, MessageCircle, BookOpen } from 'lucide-react';
import { Faq } from '@/components/sections/Faq';

export const metadata: Metadata = { title: 'Help Center' };

const CARDS = [
  { icon: BookOpen, title: 'Getting Started', description: 'Learn how to create an account, search properties, and save favorites.', href: '/faq' },
  { icon: MessageCircle, title: 'Contact Support', description: "Can't find an answer? Send us a message and we'll help directly.", href: '/contact' },
  { icon: LifeBuoy, title: 'Report an Issue', description: 'Spot something wrong with a listing? Let our team know.', href: '/contact' },
];

export default function HelpPage() {
  return (
    <div>
      <div className="container-app py-16 text-center">
        <h1 className="font-display text-4xl font-semibold">Help Center</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Find answers or get in touch with our support team.</p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-xl border border-[var(--border)] p-6 text-left transition-colors hover:border-[var(--color-primary)]"
            >
              <card.icon className="h-6 w-6 text-[var(--color-primary)]" />
              <h3 className="mt-3 font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Faq />
    </div>
  );
}
