import { Newsletter } from './newsletter.model';
import { ApiError } from '../../utils/ApiError';

export async function subscribe(email: string) {
  const existing = await Newsletter.findOne({ email });
  if (existing) throw ApiError.conflict('This email is already subscribed to our newsletter');
  return Newsletter.create({ email });
}
