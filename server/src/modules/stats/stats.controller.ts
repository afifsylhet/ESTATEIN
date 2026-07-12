import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as statsService from './stats.service';

export const getHomepageStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await statsService.getHomepageStats();
  res.json(new ApiResponse('Homepage stats fetched', stats));
});

export const getAdminOverview = catchAsync(async (_req: Request, res: Response) => {
  const stats = await statsService.getAdminOverviewStats();
  res.json(new ApiResponse('Admin overview stats fetched', stats));
});

export const getPropertiesPerMonth = catchAsync(async (_req: Request, res: Response) => {
  const data = await statsService.getPropertiesPerMonth();
  res.json(new ApiResponse('Properties per month fetched', data));
});

export const getInquiriesOverTime = catchAsync(async (_req: Request, res: Response) => {
  const data = await statsService.getInquiriesOverTime();
  res.json(new ApiResponse('Inquiries over time fetched', data));
});

export const getPropertiesByType = catchAsync(async (_req: Request, res: Response) => {
  const data = await statsService.getPropertiesByType();
  res.json(new ApiResponse('Properties by type fetched', data));
});

export const getPropertiesByStatus = catchAsync(async (_req: Request, res: Response) => {
  const data = await statsService.getPropertiesByStatus();
  res.json(new ApiResponse('Properties by status fetched', data));
});

export const getUserOverview = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsService.getUserOverviewStats(req.user!.userId);
  res.json(new ApiResponse('User overview stats fetched', stats));
});
