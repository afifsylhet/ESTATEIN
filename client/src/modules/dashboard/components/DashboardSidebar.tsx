'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Heart,
  MessageSquare,
  Settings,
  Building2,
  Tags,
  Inbox,
  Mail,
  Newspaper,
  Star,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/modules/auth/hooks/useSession';

const USER_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/inquiries', label: 'My Inquiries', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const ADMIN_LINKS = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/admin/categories', label: 'Categories', icon: Tags },
  { href: '/dashboard/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/dashboard/admin/contacts', label: 'Contact Messages', icon: Mail },
  { href: '/dashboard/admin/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/dashboard/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useSession();
  const links = pathname.startsWith('/dashboard/admin') ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] py-8 pr-6 lg:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              pathname === link.href && 'bg-[var(--muted)] text-[var(--color-primary)]'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      {isAdmin && !pathname.startsWith('/dashboard/admin') && (
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <Link href="/dashboard/admin" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
            Go to Admin Panel →
          </Link>
        </div>
      )}
    </aside>
  );
}
