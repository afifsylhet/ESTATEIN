import bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { User, IUser } from './user.model';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';
import { cloudinary } from '../../config/cloudinary';

export async function listUsers(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const filter: FilterQuery<IUser> = {};

  if (query.role) filter.role = query.role;
  if (query.search) {
    const search = String(query.search);
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, meta: buildMeta(page, limit, total) };
}

export async function getUserById(id: string): Promise<IUser> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function updateUser(
  id: string,
  updates: { name?: string; phone?: string }
): Promise<IUser> {
  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function updateAvatar(
  id: string,
  file: Express.Multer.File
): Promise<IUser> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');

  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => undefined);
  }

  user.avatar = {
    url: (file as unknown as { path: string }).path,
    publicId: (file as unknown as { filename: string }).filename,
  };
  await user.save();
  return user;
}

export async function updatePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await User.findById(id).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  if (user.provider !== 'credentials' || !user.password) {
    throw ApiError.badRequest('This account does not use a password. Use your social login instead.');
  }

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) throw ApiError.badRequest('Current password is incorrect', { currentPassword: 'Incorrect password' });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
}

export async function deleteUser(id: string): Promise<void> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => undefined);
  }
  await user.deleteOne();
}

export function toPublicUser(user: IUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    phone: user.phone,
    role: user.role,
    provider: user.provider,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}
