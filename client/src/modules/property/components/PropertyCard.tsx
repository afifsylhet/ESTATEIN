import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Bath, Ruler, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { Property } from '@/types';
import { FavoriteButton } from '@/modules/favorite/components/FavoriteButton';

const STATUS_VARIANT: Record<Property['status'], 'success' | 'warning' | 'muted' | 'destructive'> = {
  available: 'success',
  pending: 'warning',
  sold: 'muted',
  rented: 'muted',
};

export function PropertyCard({ property }: { property: Property }) {
  const coverImage = property.images[0]?.url;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
          {coverImage ? (
            <Image
              loader={cloudinaryLoader}
              src={coverImage}
              alt={property.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">No image</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={property.purpose === 'sale' ? 'default' : 'secondary'}>
              {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            <Badge variant={STATUS_VARIANT[property.status]} className="capitalize">
              {property.status}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <FavoriteButton propertyId={property._id} />
      </div>

      <div className="p-4">
        <Link href={`/properties/${property.slug}`}>
          <h3 className="line-clamp-1 font-display text-lg font-semibold hover:text-[var(--color-primary)]">
            {property.title}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.location.city}, {property.location.state}
          </span>
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
          {typeof property.specifications.bedrooms === 'number' && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.specifications.bedrooms}
            </span>
          )}
          {typeof property.specifications.bathrooms === 'number' && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.specifications.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" /> {property.specifications.areaSqft.toLocaleString()} sqft
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="font-display text-lg font-semibold text-[var(--color-primary)]">
            {formatPrice(property.price, property.priceUnit)}
          </span>
          {property.reviewCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
              <Star className="h-4 w-4 fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
              {property.averageRating.toFixed(1)} ({property.reviewCount})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
