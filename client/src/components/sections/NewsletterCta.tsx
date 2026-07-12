import { NewsletterForm } from '@/modules/newsletter/components/NewsletterForm';

export function NewsletterCta() {
  return (
    <section className="bg-[var(--color-primary)] py-16 text-white">
      <div className="container-app flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-3xl font-semibold">Never miss a new listing</h2>
        <p className="max-w-lg text-white/85">
          Subscribe to get fresh properties, price drops, and market updates delivered to your inbox.
        </p>
        <div className="w-full max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
