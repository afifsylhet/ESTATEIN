import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as blogService from './blog.service';

export const getBlogs = catchAsync(async (req: Request, res: Response) => {
  const { blogs, meta } = await blogService.listPublishedBlogs(req.query);
  res.json(new ApiResponse('Blog posts fetched', blogs, meta));
});

export const getAdminBlogs = catchAsync(async (req: Request, res: Response) => {
  const { blogs, meta } = await blogService.listAllBlogsAdmin(req.query);
  res.json(new ApiResponse('Blog posts fetched', blogs, meta));
});

export const getLatestBlogs = catchAsync(async (_req: Request, res: Response) => {
  const blogs = await blogService.getLatestBlogs(3);
  res.json(new ApiResponse('Latest blog posts fetched', blogs));
});

export const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogBySlug(String(req.params.slug));
  res.json(new ApiResponse('Blog post fetched', blog));
});

export const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.body, req.user!.userId, req.file);
  res.status(201).json(new ApiResponse('Blog post created', blog));
});

export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.updateBlog(String(req.params.id), req.body, req.file);
  res.json(new ApiResponse('Blog post updated', blog));
});

export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  await blogService.deleteBlog(String(req.params.id));
  res.json(new ApiResponse('Blog post deleted', null));
});
