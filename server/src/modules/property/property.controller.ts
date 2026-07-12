import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as propertyService from './property.service';

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const { properties, meta } = await propertyService.listProperties(req.query as Record<string, string>);
  res.json(new ApiResponse('Properties fetched', properties, meta));
});

export const getFeaturedProperties = catchAsync(async (_req: Request, res: Response) => {
  const properties = await propertyService.getFeaturedProperties();
  res.json(new ApiResponse('Featured properties fetched', properties));
});

export const getPropertyBySlug = catchAsync(async (req: Request, res: Response) => {
  const property = await propertyService.getPropertyBySlug(String(req.params.slug), true);
  res.json(new ApiResponse('Property fetched', property));
});

export const getRelatedProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await propertyService.getRelatedProperties(String(req.params.id));
  res.json(new ApiResponse('Related properties fetched', properties));
});

export const createProperty = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  const property = await propertyService.createProperty(req.body, req.user!.userId, files);
  res.status(201).json(new ApiResponse('Property listed successfully', property));
});

export const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? undefined;
  const property = await propertyService.updateProperty(String(req.params.id), req.body, files);
  res.json(new ApiResponse('Property updated', property));
});

export const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  await propertyService.deleteProperty(String(req.params.id));
  res.json(new ApiResponse('Property deleted', null));
});
