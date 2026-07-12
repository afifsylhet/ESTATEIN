'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { useSession } from '@/modules/auth/hooks/useSession';
import { createInquiryRequest } from '../api';

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000),
});
type InquiryInput = z.infer<typeof inquirySchema>;

export function InquiryForm({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { user } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      message: `Hi, I'm interested in "${propertyTitle}". Could you share more details?`,
    },
  });

  const submitInquiry = useMutation({
    mutationFn: (input: InquiryInput) => createInquiryRequest({ ...input, property: propertyId }),
    onSuccess: (res) => {
      toast({ title: 'Inquiry sent', description: res.message, variant: 'success' });
      reset();
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not send your inquiry.';
      toast({ title: 'Failed to send', description: message, variant: 'error' });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => submitInquiry.mutate(values))} className="space-y-3" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" invalid={!!errors.name} {...register('name')} />
        {errors.name && <p className="text-sm text-[var(--color-destructive)]">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" invalid={!!errors.email} {...register('email')} />
        {errors.email && <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" {...register('phone')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} invalid={!!errors.message} {...register('message')} />
        {errors.message && <p className="text-sm text-[var(--color-destructive)]">{errors.message.message}</p>}
      </div>
      <Button type="submit" className="w-full" loading={submitInquiry.isPending}>
        <Send /> Send inquiry
      </Button>
    </form>
  );
}
