import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  propertyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true, maxlength: 60 },
    slug: { type: String, unique: true, index: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 300 },
    propertyCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function preValidate(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
