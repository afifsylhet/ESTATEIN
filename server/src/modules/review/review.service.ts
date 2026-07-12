import mongoose from 'mongoose';
import { Review } from './review.model';
import { Property } from '../property/property.model';
import { ApiError } from '../../utils/ApiError';

async function refreshPropertyRating(propertyId: string) {
  const stats = await Review.aggregate([
    { $match: { property: new mongoose.Types.ObjectId(propertyId) } },
    { $group: { _id: '$property', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);
  const { averageRating = 0, reviewCount = 0 } = stats[0] ?? {};
  await Property.findByIdAndUpdate(propertyId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
  });
}

export async function listReviewsForProperty(propertyId: string) {
  return Review.find({ property: propertyId }).populate('user', 'name avatar').sort({ createdAt: -1 });
}

export async function createReview(userId: string, data: { property: string; rating: number; comment: string }) {
  const property = await Property.findById(data.property);
  if (!property) throw ApiError.notFound('Property not found');

  const existing = await Review.findOne({ property: data.property, user: userId });
  if (existing) throw ApiError.conflict('You have already reviewed this property');

  const review = await Review.create({ ...data, user: userId });
  await refreshPropertyRating(data.property);
  return review;
}

export async function deleteReview(reviewId: string, requester: { userId: string; role: string }) {
  const review = await Review.findById(reviewId);
  if (!review) throw ApiError.notFound('Review not found');
  if (requester.role !== 'admin' && review.user.toString() !== requester.userId) {
    throw ApiError.forbidden('You can only delete your own review');
  }
  const propertyId = review.property.toString();
  await review.deleteOne();
  await refreshPropertyRating(propertyId);
}
