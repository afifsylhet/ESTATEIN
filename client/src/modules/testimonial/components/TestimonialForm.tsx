'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { RatingStars } from '@/modules/review/components/RatingStars';
import { createTestimonialRequest } from '../api';

const testimonialSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  role: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(800),
  rating: z.number().min(1, 'Please select a rating').max(5),
});
type TestimonialInput = z.infer<typeof testimonialSchema>;

export function TestimonialForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialInput>({ resolver: zodResolver(testimonialSchema), defaultValues: { rating: 0 } });

  const submit = useMutation({
    mutationFn: (input: TestimonialInput) => createTestimonialRequest(input),
    onSuccess: (res) => {
      toast({ title: 'Thank you!', description: res.message, variant: 'success' });
      reset({ name: '', role: '', message: '', rating: 0 });
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not submit your testimonial.';
      toast({ title: 'Submission failed', description: message, variant: 'error' });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => submit.mutate(values))} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" invalid={!!errors.name} {...register('name')} />
          {errors.name && <p className="text-sm text-[var(--color-destructive)]">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Role (optional)</Label>
          <Input id="role" placeholder="e.g. First-time Buyer" {...register('role')} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <RatingStars value={field.value} onChange={field.onChange} />}
        />
        {errors.rating && <p className="text-sm text-[var(--color-destructive)]">{errors.rating.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Your experience</Label>
        <Textarea id="message" rows={4} invalid={!!errors.message} {...register('message')} />
        {errors.message && <p className="text-sm text-[var(--color-destructive)]">{errors.message.message}</p>}
      </div>
      <Button type="submit" loading={submit.isPending}>
        Submit testimonial
      </Button>
    </form>
  );
}
