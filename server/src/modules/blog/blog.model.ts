import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import slugify from 'slugify';
import { CloudinaryImage } from '../user/user.model';

export interface IBlog extends Document {
  title: string;
  slug: string;
  coverImage: CloudinaryImage;
  excerpt: string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 150 },
    slug: { type: String, unique: true, index: true },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    excerpt: { type: String, required: [true, 'Excerpt is required'], trim: true, maxlength: 300 },
    content: { type: String, required: [true, 'Content is required'] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function preValidate(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
