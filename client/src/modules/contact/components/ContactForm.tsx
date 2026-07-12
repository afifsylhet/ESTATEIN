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
import { submitContactRequest } from '../api';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  subject: z.string().trim().min(3, 'Subject is required').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});
type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const submit = useMutation({
    mutationFn: (input: ContactInput) => submitContactRequest(input),
    onSuccess: (res) => {
      toast({ title: 'Message sent', description: res.message, variant: 'success' });
      reset();
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not send your message.';
      toast({ title: 'Failed to send', description: message, variant: 'error' });
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" invalid={!!errors.email} {...register('email')} />
          {errors.email && <p className="text-sm text-[var(--color-destructive)]">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" invalid={!!errors.subject} {...register('subject')} />
        {errors.subject && <p className="text-sm text-[var(--color-destructive)]">{errors.subject.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} invalid={!!errors.message} {...register('message')} />
        {errors.message && <p className="text-sm text-[var(--color-destructive)]">{errors.message.message}</p>}
      </div>
      <Button type="submit" loading={submit.isPending}>
        <Send /> Send message
      </Button>
    </form>
  );
}
