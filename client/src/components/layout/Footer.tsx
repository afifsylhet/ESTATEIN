import Link from 'next/link';
import { Building2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { NewsletterForm } from '@/modules/newsletter/components/NewsletterForm';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { href: '/properties', label: 'All Properties' },
      { href: '/properties?purpose=sale', label: 'For Sale' },
      { href: '/properties?purpose=rent', label: 'For Rent' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
      { href: '/help', label: 'Help Center' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

const SOCIALS = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]/40">
      <div className="container-app grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-[var(--color-primary)]">
            <Building2 className="h-6 w-6" />
            Estatein
          </Link>
          <p className="max-w-xs text-sm text-[var(--muted-foreground)]">
            Find your perfect place to call home. Curated listings, transparent pricing, and a team that actually answers the phone.
          </p>
          <div className="max-w-sm">
            <NewsletterForm compact />
          </div>
          <div className="flex gap-3 pt-2">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--color-primary)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--foreground)]/80 hover:text-[var(--color-primary)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] py-6">
        <p className="container-app text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Estatein. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
