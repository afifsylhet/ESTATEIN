import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertiesPageClient } from '@/modules/property/components/PropertiesPageClient';

export const metadata: Metadata = { title: 'Explore Properties' };

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="container-app py-10">Loading properties…</div>}>
      <PropertiesPageClient />
    </Suspense>
  );
}
