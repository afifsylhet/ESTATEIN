import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as inquiryService from './inquiry.service';

export const createInquiry = catchAsync(async (req: Request, res: Response) => {
  const inquiry = await inquiryService.createInquiry(req.body, req.user?.userId);
  res.status(201).json(new ApiResponse('Your inquiry has been sent. We will get back to you shortly.', inquiry));
});

export const getInquiries = catchAsync(async (req: Request, res: Response) => {
  const { inquiries, meta } = await inquiryService.listInquiries(req.query);
  res.json(new ApiResponse('Inquiries fetched', inquiries, meta));
});

export const getMyInquiries = catchAsync(async (req: Request, res: Response) => {
  const inquiries = await inquiryService.listMyInquiries(req.user!.userId);
  res.json(new ApiResponse('Your inquiries fetched', inquiries));
});

export const updateInquiryStatus = catchAsync(async (req: Request, res: Response) => {
  const inquiry = await inquiryService.updateInquiryStatus(String(req.params.id), req.body.status);
  res.json(new ApiResponse('Inquiry status updated', inquiry));
});

export const deleteInquiry = catchAsync(async (req: Request, res: Response) => {
  await inquiryService.deleteInquiry(String(req.params.id));
  res.json(new ApiResponse('Inquiry deleted', null));
});
