import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as testimonialService from './testimonial.service';

export const getTestimonials = catchAsync(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.listApprovedTestimonials();
  res.json(new ApiResponse('Testimonials fetched', testimonials));
});

export const getAdminTestimonials = catchAsync(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.listAllTestimonialsAdmin();
  res.json(new ApiResponse('Testimonials fetched', testimonials));
});

export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  res.status(201).json(new ApiResponse('Thanks for sharing your experience! It will appear once reviewed.', testimonial));
});

export const moderateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.moderateTestimonial(String(req.params.id), req.body.isApproved);
  res.json(new ApiResponse('Testimonial updated', testimonial));
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  await testimonialService.deleteTestimonial(String(req.params.id));
  res.json(new ApiResponse('Testimonial deleted', null));
});
