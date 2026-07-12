'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useCategories } from '@/modules/category/hooks/useCategories';
import { PROPERTY_TYPES, PROPERTY_PURPOSES, PROPERTY_STATUSES, FURNISHING_OPTIONS, AMENITIES_LIST } from '@/lib/constants';
import { useCreateProperty, useUpdateProperty } from '../hooks/usePropertyMutations';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import type { Property } from '@/types';

const propertyFormSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  purpose: z.enum(['sale', 'rent']),
  type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land', 'office']),
  price: z.coerce.number().positive('Price must be greater than 0'),
  priceUnit: z.enum(['total', 'per-month']),
  category: z.string().min(1, 'Select a category'),
  status: z.enum(['available', 'pending', 'sold', 'rented']),
  address: z.string().trim().min(3, 'Address is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  country: z.string().trim().min(2, 'Country is required'),
  zip: z.string().trim().min(2, 'ZIP code is required'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  areaSqft: z.coerce.number().min(1, 'Area is required'),
  yearBuilt: z.coerce.number().optional(),
  parkingSpots: z.coerce.number().min(0).optional(),
  furnishing: z.enum(['unfurnished', 'semi-furnished', 'furnished']).optional(),
  isFeatured: z.boolean().optional(),
});
type PropertyFormInput = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: Property;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const { data: categories } = useCategories();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty(property?._id ?? '');
  const isEditing = Boolean(property);

  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(property?.amenities ?? []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          purpose: property.purpose,
          type: property.type,
          price: property.price,
          priceUnit: property.priceUnit,
          category: property.category._id,
          status: property.status,
          address: property.location.address,
          city: property.location.city,
          state: property.location.state,
          country: property.location.country,
          zip: property.location.zip,
          bedrooms: property.specifications.bedrooms,
          bathrooms: property.specifications.bathrooms,
          areaSqft: property.specifications.areaSqft,
          yearBuilt: property.specifications.yearBuilt,
          parkingSpots: property.specifications.parkingSpots,
          furnishing: property.specifications.furnishing,
          isFeatured: property.isFeatured,
        }
      : { purpose: 'sale', type: 'apartment', priceUnit: 'total', status: 'available' },
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const MAX_SIZE = 5 * 1024 * 1024;
    const oversized = files.filter((f) => f.size > MAX_SIZE);
    if (oversized.length > 0) {
      toast({ title: 'Some images are too large', description: 'Each image must be under 5MB.', variant: 'error' });
    }
    setNewFiles((prev) => [...prev, ...files.filter((f) => f.size <= MAX_SIZE)].slice(0, 10));
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]));
  }

  function onSubmit(values: PropertyFormInput) {
    if (!isEditing && newFiles.length === 0) {
      toast({ title: 'At least one image is required', variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('purpose', values.purpose);
    formData.append('type', values.type);
    formData.append('price', String(values.price));
    formData.append('priceUnit', values.priceUnit);
    formData.append('category', values.category);
    formData.append('status', values.status);
    formData.append('isFeatured', String(values.isFeatured ?? false));
    formData.append(
      'location',
      JSON.stringify({ address: values.address, city: values.city, state: values.state, country: values.country, zip: values.zip })
    );
    formData.append(
      'specifications',
      JSON.stringify({
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        areaSqft: values.areaSqft,
        yearBuilt: values.yearBuilt,
        parkingSpots: values.parkingSpots,
        furnishing: values.furnishing,
      })
    );
    formData.append('amenities', JSON.stringify(selectedAmenities));
    newFiles.forEach((file) => formData.append('images', file));

    if (isEditing) {
      updateProperty.mutate(formData);
    } else {
      createProperty.mutate(formData);
    }
  }

  const isPending = createProperty.isPending || updateProperty.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section className="space-y-4">
        <h2 className="font-semibold">Basic Information</h2>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" invalid={!!errors.title} {...register('title')} />
          {errors.title && <p className="text-sm text-[var(--color-destructive)]">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={5} invalid={!!errors.description} {...register('description')} />
          {errors.description && <p className="text-sm text-[var(--color-destructive)]">{errors.description.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Controller
              control={control}
              name="purpose"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_PURPOSES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-sm text-[var(--color-destructive)]">{errors.category.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" invalid={!!errors.price} {...register('price')} />
            {errors.price && <p className="text-sm text-[var(--color-destructive)]">{errors.price.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Price Unit</Label>
            <Controller
              control={control}
              name="priceUnit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="per-month">Per Month</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded border-[var(--border)]" />
          Feature this property on the homepage
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Location</h2>
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" invalid={!!errors.address} {...register('address')} />
          {errors.address && <p className="text-sm text-[var(--color-destructive)]">{errors.address.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" invalid={!!errors.city} {...register('city')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input id="state" invalid={!!errors.state} {...register('state')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" invalid={!!errors.country} {...register('country')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zip">ZIP / Postal Code</Label>
            <Input id="zip" invalid={!!errors.zip} {...register('zip')} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Specifications</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" type="number" {...register('bedrooms')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" {...register('bathrooms')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="areaSqft">Area (sqft)</Label>
            <Input id="areaSqft" type="number" invalid={!!errors.areaSqft} {...register('areaSqft')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input id="yearBuilt" type="number" {...register('yearBuilt')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parkingSpots">Parking Spots</Label>
            <Input id="parkingSpots" type="number" {...register('parkingSpots')} />
          </div>
          <div className="space-y-1.5">
            <Label>Furnishing</Label>
            <Controller
              control={control}
              name="furnishing"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {FURNISHING_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Amenities</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {AMENITIES_LIST.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              {amenity}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Photos {isEditing && '(uploading new photos replaces all existing ones)'}</h2>
        {isEditing && property && newFiles.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {property.images.map((img) => (
              <div key={img.publicId} className="relative h-20 w-24 overflow-hidden rounded-lg">
                <Image loader={cloudinaryLoader} src={img.url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {newFiles.map((file, idx) => (
            <div key={idx} className="relative h-20 w-24 overflow-hidden rounded-lg border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setNewFiles((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload /> Upload photos
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
      </section>

      <Button type="submit" size="lg" loading={isPending}>
        {isEditing ? 'Save Changes' : 'List Property'}
      </Button>
    </form>
  );
}
