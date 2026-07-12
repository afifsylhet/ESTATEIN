'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from '@/modules/auth/hooks/useSession';
import { useFavorites } from '../hooks/useFavorites';
import { useToggleFavorite } from '../hooks/useToggleFavorite';

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { data: favorites } = useFavorites();
  const toggle = useToggleFavorite();

  const isFavorited = Boolean(favorites?.some((f) => f.property._id === propertyId));

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          router.push('/login');
          return;
        }
        toggle.mutate({ propertyId, isFavorited });
      }}
      disabled={toggle.isPending}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-transform hover:scale-105 disabled:opacity-60"
    >
      <Heart className={cn('h-4 w-4', isFavorited && 'fill-red-500 text-red-500')} />
    </button>
  );
}
