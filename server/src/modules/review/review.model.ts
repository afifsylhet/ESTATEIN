import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
  property: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, 'Comment is required'], trim: true, minlength: 5, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
