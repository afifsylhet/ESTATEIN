export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: CloudinaryImage;
  phone?: string;
  role: Role;
  provider: 'credentials' | 'google';
  isVerified: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  propertyCount: number;
}

export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'office';
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';
export type FurnishingType = 'unfurnished' | 'semi-furnished' | 'furnished';

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: number;
  priceUnit: 'total' | 'per-month';
  category: Category;
  images: CloudinaryImage[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    coordinates?: { lat: number; lng: number };
  };
  specifications: {
    bedrooms?: number;
    bathrooms?: number;
    areaSqft: number;
    yearBuilt?: number;
    parkingSpots?: number;
    furnishing?: FurnishingType;
  };
  amenities: string[];
  status: PropertyStatus;
  isFeatured: boolean;
  views: number;
  averageRating: number;
  reviewCount: number;
  listedBy: { _id: string; name: string; avatar?: CloudinaryImage; email?: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  property: string;
  user: { _id: string; name: string; avatar?: CloudinaryImage };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  property: Property;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  property: Property | string;
  user?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  coverImage: CloudinaryImage;
  excerpt: string;
  content: string;
  author: { _id: string; name: string; avatar?: CloudinaryImage };
  tags: string[];
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  avatar?: CloudinaryImage;
  message: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface HomepageStats {
  totalProperties: number;
  citiesCovered: number;
  happyClients: number;
  averageRating: number;
  categories: Category[];
}

export interface AdminOverviewStats {
  totalProperties: number;
  totalUsers: number;
  totalInquiries: number;
  soldOrRentedThisMonth: number;
}
