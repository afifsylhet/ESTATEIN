import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as categoryService from './category.service';

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  res.json(new ApiResponse('Categories fetched', categories));
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(new ApiResponse('Category created', category));
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(String(req.params.id), req.body);
  res.json(new ApiResponse('Category updated', category));
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(String(req.params.id));
  res.json(new ApiResponse('Category deleted', null));
});
