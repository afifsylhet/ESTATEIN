import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as contactService from './contact.service';

export const createContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await contactService.createContact(req.body);
  res.status(201).json(new ApiResponse('Thanks for reaching out — we will reply soon.', contact));
});

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const { contacts, meta } = await contactService.listContacts(req.query);
  res.json(new ApiResponse('Contact submissions fetched', contacts, meta));
});

export const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
  const contact = await contactService.updateContactStatus(String(req.params.id), req.body.status);
  res.json(new ApiResponse('Status updated', contact));
});
