import mongoose, { Schema, Document, Model } from 'mongoose';
import { CloudinaryImage } from '../user/user.model';

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  avatar?: CloudinaryImage;
  message: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    role: { type: String, trim: true },
    avatar: { url: String, publicId: String },
    message: { type: String, required: [true, 'Message is required'], trim: true, minlength: 10, maxlength: 800 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
