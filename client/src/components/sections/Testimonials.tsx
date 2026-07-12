import { serverFetch } from '@/lib/server-fetch';
import { TestimonialCard } from '@/modules/testimonial/components/TestimonialCard';
import type { ApiSuccess, Testimonial } from '@/types';

export async function Testimonials() {
  let testimonials: Testimonial[] = [];
  try {
    const res = await serverFetch<ApiSuccess<Testimonial[]>>('/testimonials', { tags: ['testimonials'] });
    testimonials = res.data.slice(0, 6);
  } catch {
    testimonials = [];
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="container-app py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-semibold">What Our Clients Say</h2>
        <p className="mt-1 text-[var(--muted-foreground)]">Real stories from people who found their place with us.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t._id} testimonial={t} />
        ))}
      </div>
    </section>
  );
}
