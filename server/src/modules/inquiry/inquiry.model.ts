import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IInquiry extends Document {
  property: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true, minlength: 5, maxlength: 2000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema);
