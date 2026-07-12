import { Property } from '../property/property.model';
import { User } from '../user/user.model';
import { Inquiry } from '../inquiry/inquiry.model';
import { Category } from '../category/category.model';
import { Review } from '../review/review.model';
import { Favorite } from '../favorite/favorite.model';

export async function getHomepageStats() {
  const [totalProperties, citiesAgg, avgRatingAgg, categories] = await Promise.all([
    Property.countDocuments({ status: 'available' }),
    Property.distinct('location.city'),
    Property.aggregate([{ $group: { _id: null, avg: { $avg: '$averageRating' } } }]),
    Category.find().sort({ propertyCount: -1 }).limit(6),
  ]);

  // "Happy clients" is modeled as the count of users who have submitted at least one review —
  // a real, queryable proxy for satisfied customers rather than an invented number.
  const happyClients = (await Review.distinct('user')).length;

  return {
    totalProperties,
    citiesCovered: citiesAgg.filter(Boolean).length,
    happyClients,
    averageRating: Math.round((avgRatingAgg[0]?.avg ?? 0) * 10) / 10,
    categories,
  };
}

export async function getAdminOverviewStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalProperties, totalUsers, totalInquiries, soldOrRentedThisMonth] = await Promise.all([
    Property.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Inquiry.countDocuments(),
    Property.countDocuments({
      status: { $in: ['sold', 'rented'] },
      updatedAt: { $gte: startOfMonth },
    }),
  ]);

  return { totalProperties, totalUsers, totalInquiries, soldOrRentedThisMonth };
}

export async function getPropertiesPerMonth() {
  return Property.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);
}

export async function getInquiriesOverTime() {
  return Inquiry.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    { $limit: 30 },
  ]);
}

export async function getPropertiesByType() {
  return Property.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
}

export async function getPropertiesByStatus() {
  return Property.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
}

export async function getUserOverviewStats(userId: string) {
  const [favoritesCount, inquiriesCount, reviewsCount] = await Promise.all([
    Favorite.countDocuments({ user: userId }),
    Inquiry.countDocuments({ user: userId }),
    Review.countDocuments({ user: userId }),
  ]);

  return { favoritesCount, inquiriesCount, reviewsCount };
}
