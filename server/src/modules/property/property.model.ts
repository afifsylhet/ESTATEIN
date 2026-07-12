import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CloudinaryImage } from '../user/user.model';

export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'office';
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';
export type FurnishingType = 'unfurnished' | 'semi-furnished' | 'furnished';

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: number;
  priceUnit: 'total' | 'per-month';
  category: Types.ObjectId;
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
  listedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 150 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: [true, 'Description is required'], trim: true, minlength: 20 },
    purpose: { type: String, enum: ['sale', 'rent'], required: true },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'commercial', 'land', 'office'],
      required: true,
    },
    price: { type: Number, required: [true, 'Price is required'], min: [1, 'Price must be greater than 0'] },
    priceUnit: { type: String, enum: ['total', 'per-month'], default: 'total' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: {
      type: [{ url: String, publicId: String }],
      validate: {
        validator: (arr: CloudinaryImage[]) => arr.length >= 1,
        message: 'At least one property image is required',
      },
    },
    location: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true, index: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      zip: { type: String, required: true, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    specifications: {
      bedrooms: { type: Number, min: 0 },
      bathrooms: { type: Number, min: 0 },
      areaSqft: { type: Number, required: true, min: 1 },
      yearBuilt: { type: Number },
      parkingSpots: { type: Number, min: 0 },
      furnishing: { type: String, enum: ['unfurnished', 'semi-furnished', 'furnished'] },
    },
    amenities: { type: [String], default: [] },
    status: { type: String, enum: ['available', 'pending', 'sold', 'rented'], default: 'available' },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    listedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

propertySchema.pre('validate', function preValidate(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
propertySchema.index({ purpose: 1, type: 1, price: 1 });
propertySchema.index({ isFeatured: 1, createdAt: -1 });

export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);
