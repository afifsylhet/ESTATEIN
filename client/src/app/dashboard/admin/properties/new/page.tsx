'use client';

import { PropertyForm } from '@/modules/property/components/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">List a New Property</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Fill in the details below to publish a new listing.</p>
      <div className="mt-8 max-w-3xl">
        <PropertyForm />
      </div>
    </div>
  );
}
