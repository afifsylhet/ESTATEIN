'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Heart, Settings, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { initials } from '@/lib/utils';
import { useSession } from '@/modules/auth/hooks/useSession';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import cloudinaryLoader from '@/lib/cloudinary-loader';

const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: UserIcon },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const;

export function ProfileDropdown() {
  const { user } = useSession();
  const logout = useLogout();
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
        {user.avatar?.url ? (
          <Image loader={cloudinaryLoader} src={user.avatar.url} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
        ) : (
          initials(user.name)
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[var(--foreground)]">{user.name}</span>
          <span className="truncate text-xs font-normal">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} onSelect={() => router.push(href)}>
            <Icon /> {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout.mutate()} className="text-[var(--color-destructive)]">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
