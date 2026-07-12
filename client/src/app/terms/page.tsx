import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="container-app max-w-3xl py-16">
      <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">Last updated: January 2026</p>

      <div className="prose mt-8 max-w-none space-y-6 text-[var(--foreground)]/90">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 text-sm">
            By accessing or using Estatein, you agree to be bound by these Terms of Service. If you do not agree,
            please do not use the platform.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">2. Account Responsibilities</h2>
          <p className="mt-2 text-sm">
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity that occurs under your account.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">3. Listing Accuracy</h2>
          <p className="mt-2 text-sm">
            While we strive to keep listings accurate and up to date, Estatein does not guarantee the availability,
            price, or condition of any property. Always verify details directly with the listing agent.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">4. Prohibited Conduct</h2>
          <p className="mt-2 text-sm">
            You may not use Estatein to post false information, harass other users, or attempt to circumvent our
            security measures.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">5. Limitation of Liability</h2>
          <p className="mt-2 text-sm">
            Estatein is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
            damages arising from your use of the platform or reliance on listing information.
          </p>
        </section>
      </div>
    </div>
  );
}
