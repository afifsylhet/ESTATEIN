import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as newsletterService from './newsletter.service';

export const subscribe = catchAsync(async (req: Request, res: Response) => {
  const subscription = await newsletterService.subscribe(req.body.email);
  res.status(201).json(new ApiResponse("You're subscribed! Watch your inbox for new listings.", subscription));
});
