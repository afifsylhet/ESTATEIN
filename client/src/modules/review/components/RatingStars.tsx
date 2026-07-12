'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function RatingStars({ value, onChange, readOnly, size = 20 }: RatingStarsProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1" role={readOnly ? undefined : 'radiogroup'} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className={cn(!readOnly && 'cursor-pointer')}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(star <= display ? 'fill-[var(--color-secondary)] text-[var(--color-secondary)]' : 'text-[var(--muted-foreground)]')}
          />
        </button>
      ))}
    </div>
  );
}
