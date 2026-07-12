import Image from 'next/image';
import { Quote } from 'lucide-react';
import { RatingStars } from '@/modules/review/components/RatingStars';
import { initials } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { Testimonial } from '@/types';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div>
        <Quote className="h-6 w-6 text-[var(--color-secondary)]" />
        <p className="mt-3 text-sm text-[var(--foreground)]/90">&ldquo;{testimonial.message}&rdquo;</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--muted)] text-sm font-semibold">
          {testimonial.avatar?.url ? (
            <Image loader={cloudinaryLoader} src={testimonial.avatar.url} alt={testimonial.name} width={40} height={40} className="h-full w-full object-cover" />
          ) : (
            initials(testimonial.name)
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          {testimonial.role && <p className="text-xs text-[var(--muted-foreground)]">{testimonial.role}</p>}
        </div>
        <div className="ml-auto">
          <RatingStars value={testimonial.rating} readOnly size={14} />
        </div>
      </div>
    </div>
  );
}
