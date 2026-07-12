import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as userService from './user.service';

function assertSelfOrAdmin(req: Request, targetId: string) {
  if (req.user!.role !== 'admin' && req.user!.userId !== targetId) {
    throw ApiError.forbidden('You can only manage your own account');
  }
}

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { users, meta } = await userService.listUsers(req.query);
  res.json(new ApiResponse('Users fetched', users.map(userService.toPublicUser), meta));
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  assertSelfOrAdmin(req, String(req.params.id));
  const user = await userService.getUserById(String(req.params.id));
  res.json(new ApiResponse('User fetched', userService.toPublicUser(user)));
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  assertSelfOrAdmin(req, String(req.params.id));
  const user = await userService.updateUser(String(req.params.id), req.body);
  res.json(new ApiResponse('Profile updated', userService.toPublicUser(user)));
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  assertSelfOrAdmin(req, String(req.params.id));
  if (!req.file) throw ApiError.badRequest('An image file is required');
  const user = await userService.updateAvatar(String(req.params.id), req.file);
  res.json(new ApiResponse('Avatar updated', userService.toPublicUser(user)));
});

export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  assertSelfOrAdmin(req, String(req.params.id));
  const { currentPassword, newPassword } = req.body;
  await userService.updatePassword(String(req.params.id), currentPassword, newPassword);
  res.json(new ApiResponse('Password updated successfully', null));
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(String(req.params.id));
  res.json(new ApiResponse('User deleted', null));
});
