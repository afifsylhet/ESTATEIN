import { z } from 'zod';

const specificationsSchema = z.object({
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  areaSqft: z.coerce.number().min(1, 'Area is required'),
  yearBuilt: z.coerce.number().optional(),
  parkingSpots: z.coerce.number().min(0).optional(),
  furnishing: z.enum(['unfurnished', 'semi-furnished', 'furnished']).optional(),
});

const locationSchema = z.object({
  address: z.string().trim().min(3, 'Address is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  country: z.string().trim().min(2, 'Country is required'),
  zip: z.string().trim().min(2, 'ZIP/postal code is required'),
  coordinates: z.object({ lat: z.coerce.number(), lng: z.coerce.number() }).optional(),
});

const basePropertyBody = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  purpose: z.enum(['sale', 'rent'], { errorMap: () => ({ message: 'Select sale or rent' }) }),
  type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land', 'office']),
  price: z.coerce.number().positive('Price must be greater than 0'),
  priceUnit: z.enum(['total', 'per-month']).default('total'),
  category: z.string().min(1, 'Category is required'),
  location: locationSchema,
  specifications: specificationsSchema,
  amenities: z.array(z.string()).optional().default([]),
  status: z.enum(['available', 'pending', 'sold', 'rented']).optional(),
  isFeatured: z.coerce.boolean().optional(),
});

export const createPropertySchema = z.object({
  body: basePropertyBody,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updatePropertySchema = z.object({
  body: basePropertyBody.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string() }),
});

export const listPropertiesQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    search: z.string().optional(),
    purpose: z.enum(['sale', 'rent']).optional(),
    type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land', 'office']).optional(),
    category: z.string().optional(),
    city: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    bedrooms: z.string().optional(),
    status: z.enum(['available', 'pending', 'sold', 'rented']).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: z.object({}).optional(),
});
