'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { useSession } from '@/modules/auth/hooks/useSession';
import { RatingStars } from './RatingStars';
import { createReviewRequest } from '../api';

export function ReviewForm({ propertyId }: { propertyId: string }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const submitReview = useMutation({
    mutationFn: () => createReviewRequest({ property: propertyId, rating, comment }),
    onSuccess: () => {
      toast({ title: 'Review submitted', description: 'Thanks for sharing your feedback!', variant: 'success' });
      setRating(0);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not submit your review.';
      toast({ title: 'Review not submitted', description: message, variant: 'error' });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
        <button className="font-medium text-[var(--color-accent)] hover:underline" onClick={() => router.push('/login')}>
          Log in
        </button>{' '}
        to leave a review.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (rating === 0) {
          toast({ title: 'Please select a rating', variant: 'error' });
          return;
        }
        submitReview.mutate();
      }}
      className="space-y-3 rounded-xl border border-[var(--border)] p-4"
    >
      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <RatingStars value={rating} onChange={setRating} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="comment">Your review</Label>
        <Textarea
          id="comment"
          required
          minLength={5}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this property…"
        />
      </div>
      <Button type="submit" loading={submitReview.isPending}>
        Submit review
      </Button>
    </form>
  );
}
