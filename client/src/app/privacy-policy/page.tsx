import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="container-app max-w-3xl py-16">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">Last updated: January 2026</p>

      <div className="prose mt-8 max-w-none space-y-6 text-[var(--foreground)]/90">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Information We Collect</h2>
          <p className="mt-2 text-sm">
            We collect information you provide directly to us, such as your name, email address, and phone number
            when you create an account, submit an inquiry, or contact us. We also collect usage data such as pages
            viewed and properties favorited to improve our recommendations.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="mt-2 text-sm">
            We use your information to operate and improve Estatein, respond to your inquiries, connect you with
            listing agents, and send you updates you&apos;ve opted into (like our newsletter). We never sell your
            personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">3. Data Security</h2>
          <p className="mt-2 text-sm">
            Passwords are hashed using industry-standard algorithms, and access to your data is protected by
            role-based permissions and encrypted connections (HTTPS).
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">4. Your Rights</h2>
          <p className="mt-2 text-sm">
            You may access, update, or delete your account information at any time from your dashboard settings, or
            by contacting us directly.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">5. Contact Us</h2>
          <p className="mt-2 text-sm">Questions about this policy? Reach out at privacy@estatein.com.</p>
        </section>
      </div>
    </div>
  );
}
