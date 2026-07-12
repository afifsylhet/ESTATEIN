'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, initials } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { listReviewsRequest } from '../api';

export function ReviewList({ propertyId }: { propertyId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => listReviewsRequest(propertyId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your experience." />;
  }

  return (
    <div className="space-y-4">
      {data.map((review) => (
        <div key={review._id} className="flex gap-3 rounded-xl border border-[var(--border)] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--muted)] text-sm font-semibold">
            {review.user.avatar?.url ? (
              <Image loader={cloudinaryLoader} src={review.user.avatar.url} alt={review.user.name} width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              initials(review.user.name)
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{review.user.name}</p>
              <span className="text-xs text-[var(--muted-foreground)]">{formatDate(review.createdAt)}</span>
            </div>
            <RatingStars value={review.rating} readOnly size={14} />
            <p className="mt-2 text-sm text-[var(--foreground)]/90">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
