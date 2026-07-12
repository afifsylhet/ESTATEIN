'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { CloudinaryImage } from '@/types';

export function PropertyGallery({ images, title }: { images: CloudinaryImage[]; title: string }) {
  const [active, setActive] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  if (images.length === 0) {
    return <div className="aspect-video w-full rounded-xl bg-[var(--muted)]" />;
  }

  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--muted)]">
        <Image
          loader={cloudinaryLoader}
          src={images[active].url}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Expand image"
        >
          <Expand className="h-4 w-4" />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={img.publicId}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                'relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2',
                idx === active ? 'border-[var(--color-primary)]' : 'border-transparent'
              )}
            >
              <Image loader={cloudinaryLoader} src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image loader={cloudinaryLoader} src={images[active].url} alt={title} fill sizes="90vw" className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
