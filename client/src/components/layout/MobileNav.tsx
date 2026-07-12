'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/modules/auth/hooks/useSession';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { cn } from '@/lib/utils';

const LOGGED_OUT_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Explore Properties' },
  { href: '/about', label: 'About' },
];

const LOGGED_IN_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Explore Properties' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user } = useSession();
  const logout = useLogout();

  React.useEffect(() => setOpen(false), [pathname]);

  const links = user ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--background)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <span className="font-display text-xl font-semibold">Estatein</span>
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl px-4 py-3 text-base font-medium hover:bg-[var(--muted)]',
                  pathname === link.href && 'bg-[var(--muted)] text-[var(--color-primary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => logout.mutate()}>
                  Log out
                </Button>
              ) : (
                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
