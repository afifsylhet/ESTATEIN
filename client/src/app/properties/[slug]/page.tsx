import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BedDouble, Bath, Ruler, Car, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import { Badge } from '@/components/ui/badge';
import { PropertyGallery } from '@/modules/property/components/PropertyGallery';
import { FavoriteButton } from '@/modules/favorite/components/FavoriteButton';
import { InquiryForm } from '@/modules/inquiry/components/InquiryForm';
import { ReviewList } from '@/modules/review/components/ReviewList';
import { ReviewForm } from '@/modules/review/components/ReviewForm';
import { RelatedProperties } from '@/modules/property/components/RelatedProperties';
import { formatPrice, initials } from '@/lib/utils';
import type { ApiSuccess, Property } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string): Promise<Property | null> {
  try {
    const res = await serverFetch<ApiSuccess<Property>>(`/properties/${slug}`, { revalidate: 30 });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: 'Property Not Found' };
  return {
    title: property.title,
    description: property.description.slice(0, 155),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 155),
      images: property.images[0] ? [property.images[0].url] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const listedBy = typeof property.listedBy === 'object' ? property.listedBy : null;

  return (
    <div className="container-app py-10">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={property.purpose === 'sale' ? 'default' : 'secondary'}>
                    {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {property.type}
                  </Badge>
                </div>
                <h1 className="mt-2 font-display text-3xl font-semibold">{property.title}</h1>
                <p className="mt-1 flex items-center gap-1 text-[var(--muted-foreground)]">
                  <MapPin className="h-4 w-4" />
                  {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-semibold text-[var(--color-primary)]">
                  {formatPrice(property.price, property.priceUnit)}
                </span>
                <FavoriteButton propertyId={property._id} />
              </div>
            </div>
          </div>

          <PropertyGallery images={property.images} title={property.title} />

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[var(--border)] p-4 sm:grid-cols-4">
            {typeof property.specifications.bedrooms === 'number' && (
              <Spec icon={BedDouble} label="Bedrooms" value={property.specifications.bedrooms} />
            )}
            {typeof property.specifications.bathrooms === 'number' && (
              <Spec icon={Bath} label="Bathrooms" value={property.specifications.bathrooms} />
            )}
            <Spec icon={Ruler} label="Area" value={`${property.specifications.areaSqft.toLocaleString()} sqft`} />
            {typeof property.specifications.parkingSpots === 'number' && (
              <Spec icon={Car} label="Parking" value={property.specifications.parkingSpots} />
            )}
            {property.specifications.yearBuilt && (
              <Spec icon={Calendar} label="Year Built" value={property.specifications.yearBuilt} />
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">About this property</h2>
            <p className="mt-3 whitespace-pre-line text-[var(--foreground)]/90">{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Amenities</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" /> {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-xl font-semibold">
              Reviews {property.reviewCount > 0 && `(${property.reviewCount})`}
            </h2>
            <div className="mt-4 space-y-6">
              <ReviewForm propertyId={property._id} />
              <ReviewList propertyId={property._id} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-semibold">Listed by</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-semibold">
                {listedBy ? initials(listedBy.name) : 'ES'}
              </div>
              <div>
                <p className="font-medium">{listedBy?.name ?? 'Estatein Team'}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{listedBy?.email ?? 'Verified Agent'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] p-5">
            <h3 className="font-semibold">Contact agent</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Interested in this property? Send an inquiry and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-4">
              <InquiryForm propertyId={property._id} propertyTitle={property.title} />
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl font-semibold">Similar Properties</h2>
        <div className="mt-6">
          <RelatedProperties propertyId={property._id} />
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="h-5 w-5 text-[var(--color-primary)]" />
      <span className="font-semibold">{value}</span>
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
    </div>
  );
}
