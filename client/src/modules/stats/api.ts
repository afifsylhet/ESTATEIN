import { apiClient } from '@/lib/api-client';
import type { ApiSuccess, AdminOverviewStats, HomepageStats } from '@/types';

export function homepageStatsRequest() {
  return apiClient<ApiSuccess<HomepageStats>>('/stats/homepage', { method: 'GET', skipAuth: true });
}

export function adminOverviewRequest() {
  return apiClient<ApiSuccess<AdminOverviewStats>>('/stats/admin/overview', { method: 'GET' });
}

export interface UserOverviewStats { favoritesCount: number; inquiriesCount: number; reviewsCount: number }

export function userOverviewRequest() {
  return apiClient<ApiSuccess<UserOverviewStats>>('/stats/dashboard/user', { method: 'GET' });
}

export interface MonthlyBucket { _id: { year: number; month: number }; count: number }
export interface DailyBucket { _id: { year: number; month: number; day: number }; count: number }
export interface CategoryBucket { _id: string; count: number }

export function propertiesPerMonthRequest() {
  return apiClient<ApiSuccess<MonthlyBucket[]>>('/stats/admin/properties-per-month', { method: 'GET' });
}

export function inquiriesOverTimeRequest() {
  return apiClient<ApiSuccess<DailyBucket[]>>('/stats/admin/inquiries-over-time', { method: 'GET' });
}

export function propertiesByTypeRequest() {
  return apiClient<ApiSuccess<CategoryBucket[]>>('/stats/admin/properties-by-type', { method: 'GET' });
}

export function propertiesByStatusRequest() {
  return apiClient<ApiSuccess<CategoryBucket[]>>('/stats/admin/properties-by-status', { method: 'GET' });
}
