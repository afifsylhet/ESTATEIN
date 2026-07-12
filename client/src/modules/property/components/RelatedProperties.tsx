'use client';

import { useRelatedProperties } from '../hooks/useRelatedProperties';
import { PropertyGrid } from './PropertyGrid';

export function RelatedProperties({ propertyId }: { propertyId: string }) {
  const { data, isLoading } = useRelatedProperties(propertyId);

  if (!isLoading && (!data || data.length === 0)) return null;

  return <PropertyGrid properties={data} isLoading={isLoading} />;
}
