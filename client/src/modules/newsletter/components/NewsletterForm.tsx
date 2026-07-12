'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { ApiClientError } from '@/lib/api-client';
import { subscribeRequest } from '../api';

export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = React.useState('');

  const subscribe = useMutation({
    mutationFn: () => subscribeRequest(email),
    onSuccess: (res) => {
      toast({ title: 'Subscribed!', description: res.message, variant: 'success' });
      setEmail('');
    },
    onError: (err) => {
      const message = err instanceof ApiClientError ? err.message : 'Could not subscribe. Please try again.';
      toast({ title: 'Subscription failed', description: message, variant: 'error' });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) subscribe.mutate();
      }}
      className="flex gap-2"
    >
      <Input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={compact ? 'h-10' : 'h-12'}
      />
      <Button type="submit" size={compact ? 'default' : 'lg'} loading={subscribe.isPending} aria-label="Subscribe">
        <Send />
      </Button>
    </form>
  );
}
