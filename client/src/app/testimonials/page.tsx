import type { Metadata } from 'next';
import { TestimonialForm } from '@/modules/testimonial/components/TestimonialForm';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata: Metadata = { title: 'Share Your Experience' };

export default function TestimonialsPage() {
  return (
    <div>
      <div className="container-app max-w-xl py-16">
        <h1 className="font-display text-4xl font-semibold">Share your experience</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Found your place with Estatein? Let others know how it went. Submissions are reviewed before appearing publicly.
        </p>
        <div className="mt-8 rounded-xl border border-[var(--border)] p-6">
          <TestimonialForm />
        </div>
      </div>
      <Testimonials />
    </div>
  );
}
