import { FilterQuery } from 'mongoose';
import { Inquiry, IInquiry } from './inquiry.model';
import { Property } from '../property/property.model';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';

export async function createInquiry(
  data: { property: string; name: string; email: string; phone?: string; message: string },
  userId?: string
) {
  const property = await Property.findById(data.property);
  if (!property) throw ApiError.notFound('Property not found');
  return Inquiry.create({ ...data, user: userId });
}

export async function listInquiries(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const filter: FilterQuery<IInquiry> = {};
  if (query.status) filter.status = query.status;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('property', 'title slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  return { inquiries, meta: buildMeta(page, limit, total) };
}

export async function listMyInquiries(userId: string) {
  return Inquiry.find({ user: userId }).populate('property', 'title slug images').sort({ createdAt: -1 });
}

export async function updateInquiryStatus(id: string, status: IInquiry['status']) {
  const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
  return inquiry;
}

export async function deleteInquiry(id: string) {
  const inquiry = await Inquiry.findByIdAndDelete(id);
  if (!inquiry) throw ApiError.notFound('Inquiry not found');
}
