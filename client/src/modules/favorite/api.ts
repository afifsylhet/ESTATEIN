import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, Favorite } from '@/types';

export function listFavoritesRequest() {
  return apiClient<ApiSuccess<Favorite[]>>('/favorites', { method: 'GET' });
}

export function addFavoriteRequest(propertyId: string) {
  return apiClient<ApiSuccess<Favorite>>('/favorites', { method: 'POST', body: { property: propertyId } });
}

export function removeFavoriteRequest(propertyId: string) {
  return apiClient<ApiSuccess<null>>(`/favorites/${propertyId}`, { method: 'DELETE' });
}
