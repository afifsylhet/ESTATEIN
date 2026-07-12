import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/modules/contact/components/ContactForm';

export const metadata: Metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold">Get in Touch</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Have a question about a listing or need help finding the right place? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-[var(--muted-foreground)]">hello@estatein.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-[var(--muted-foreground)]">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-medium">Office</p>
                <p className="text-sm text-[var(--muted-foreground)]">123 Market Street, Suite 400, San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] p-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
