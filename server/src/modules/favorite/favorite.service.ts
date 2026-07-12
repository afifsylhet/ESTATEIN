import { Favorite } from './favorite.model';
import { Property } from '../property/property.model';
import { ApiError } from '../../utils/ApiError';

export async function listFavorites(userId: string) {
  return Favorite.find({ user: userId })
    .populate({ path: 'property', populate: { path: 'category', select: 'name slug' } })
    .sort({ createdAt: -1 });
}

export async function addFavorite(userId: string, propertyId: string) {
  const property = await Property.findById(propertyId);
  if (!property) throw ApiError.notFound('Property not found');

  const existing = await Favorite.findOne({ user: userId, property: propertyId });
  if (existing) throw ApiError.conflict('Property is already in your favorites');

  return Favorite.create({ user: userId, property: propertyId });
}

export async function removeFavorite(userId: string, propertyId: string) {
  const result = await Favorite.findOneAndDelete({ user: userId, property: propertyId });
  if (!result) throw ApiError.notFound('Favorite not found');
}
