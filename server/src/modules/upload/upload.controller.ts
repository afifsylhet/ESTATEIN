import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('An image file is required');
  const file = req.file as unknown as { path: string; filename: string };
  res.status(201).json(new ApiResponse('Image uploaded', { url: file.path, publicId: file.filename }));
});
