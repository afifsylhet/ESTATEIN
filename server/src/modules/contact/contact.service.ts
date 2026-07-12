import { Contact } from './contact.model';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';

export async function createContact(data: { name: string; email: string; subject: string; message: string }) {
  return Contact.create(data);
}

export async function listContacts(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const filter = query.status ? { status: query.status } : {};
  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);
  return { contacts, meta: buildMeta(page, limit, total) };
}

export async function updateContactStatus(id: string, status: 'new' | 'read' | 'resolved') {
  const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!contact) throw ApiError.notFound('Contact submission not found');
  return contact;
}
