import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true, maxlength: 150 },
    message: { type: String, required: [true, 'Message is required'], trim: true, minlength: 10, maxlength: 2000 },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);
