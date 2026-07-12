import { Testimonial } from './testimonial.model';
import { ApiError } from '../../utils/ApiError';

export async function listApprovedTestimonials() {
  return Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).limit(12);
}

export async function listAllTestimonialsAdmin() {
  return Testimonial.find().sort({ createdAt: -1 });
}

export async function createTestimonial(data: { name: string; role?: string; message: string; rating: number }) {
  return Testimonial.create(data);
}

export async function moderateTestimonial(id: string, isApproved: boolean) {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { isApproved }, { new: true });
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
}
