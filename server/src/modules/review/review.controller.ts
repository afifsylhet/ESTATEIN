import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as reviewService from './review.service';

export const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.listReviewsForProperty(String(req.params.propertyId));
  res.json(new ApiResponse('Reviews fetched', reviews));
});

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.userId, req.body);
  res.status(201).json(new ApiResponse('Review submitted', review));
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await reviewService.deleteReview(String(req.params.id), req.user!);
  res.json(new ApiResponse('Review deleted', null));
});
