'use client';

import { useQuery } from '@tanstack/react-query';
import {
  adminOverviewRequest,
  propertiesPerMonthRequest,
  inquiriesOverTimeRequest,
  propertiesByTypeRequest,
  propertiesByStatusRequest,
} from '../api';

export function useAdminOverview() {
  return useQuery({ queryKey: ['stats', 'overview'], queryFn: () => adminOverviewRequest().then((r) => r.data) });
}

export function usePropertiesPerMonth() {
  return useQuery({ queryKey: ['stats', 'properties-per-month'], queryFn: () => propertiesPerMonthRequest().then((r) => r.data) });
}

export function useInquiriesOverTime() {
  return useQuery({ queryKey: ['stats', 'inquiries-over-time'], queryFn: () => inquiriesOverTimeRequest().then((r) => r.data) });
}

export function usePropertiesByType() {
  return useQuery({ queryKey: ['stats', 'properties-by-type'], queryFn: () => propertiesByTypeRequest().then((r) => r.data) });
}

export function usePropertiesByStatus() {
  return useQuery({ queryKey: ['stats', 'properties-by-status'], queryFn: () => propertiesByStatusRequest().then((r) => r.data) });
}
