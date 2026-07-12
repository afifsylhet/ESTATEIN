import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as favoriteService from './favorite.service';

export const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  const favorites = await favoriteService.listFavorites(req.user!.userId);
  res.json(new ApiResponse('Favorites fetched', favorites));
});

export const addFavorite = catchAsync(async (req: Request, res: Response) => {
  const favorite = await favoriteService.addFavorite(req.user!.userId, req.body.property);
  res.status(201).json(new ApiResponse('Added to favorites', favorite));
});

export const removeFavorite = catchAsync(async (req: Request, res: Response) => {
  await favoriteService.removeFavorite(req.user!.userId, String(req.params.propertyId));
  res.json(new ApiResponse('Removed from favorites', null));
});
