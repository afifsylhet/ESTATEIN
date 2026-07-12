import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { toPublicUser } from '../user/user.service';
import { isProd } from '../../config/env';
import * as authService from './auth.service';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Path is '/' (not just the auth routes) so the browser also sends the cookie
// on page navigations (e.g. /dashboard), letting Next.js Server Components read
// it via cookies() to resolve the session during server-side rendering.
const REFRESH_COOKIE_PATH = '/';

// A cookie can only be deleted by a Set-Cookie whose name, path, domain — and,
// for modern browsers, the secure/sameSite pairing — match the cookie that was
// created. Defining the attributes once guarantees set and clear stay in lockstep.
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: REFRESH_COOKIE_PATH,
} as const;

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    ...refreshCookieOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });
}

function clearRefreshCookie(res: Response) {
  // Same attributes as when it was set (minus maxAge, which clearCookie overrides
  // with an expired date) so the browser reliably removes the cookie.
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(201).json(new ApiResponse('Account created successfully', { user: toPublicUser(user), accessToken }));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body.email, req.body.password);
  setRefreshCookie(res, refreshToken);
  res.json(new ApiResponse('Logged in successfully', { user: toPublicUser(user), accessToken }));
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('No refresh token provided');
  const { user, accessToken, refreshToken } = await authService.refreshAccessToken(token);
  setRefreshCookie(res, refreshToken);
  res.json(new ApiResponse('Token refreshed', { user: toPublicUser(user), accessToken }));
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  // Logout must succeed even with a missing/expired access token, otherwise the
  // cookie would linger and the middleware would keep treating the visitor as
  // logged in. We revoke server-side using the refresh cookie (best-effort) and
  // always clear the cookie.
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) await authService.revokeRefreshToken(token);
  clearRefreshCookie(res);
  res.json(new ApiResponse('Logged out successfully', null));
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  try {
    await authService.requestPasswordReset(req.body.email);
  } catch (err) {
    // Swallow delivery/DB errors here: the response is intentionally neutral so
    // we never leak whether an account exists or that SMTP failed. Logged for ops.
    // eslint-disable-next-line no-console
    console.error('Password reset request failed:', (err as Error).message);
  }
  res.json(
    new ApiResponse('If an account exists for that email, a password reset link has been sent.', null),
  );
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.json(new ApiResponse('Your password has been reset. You can now log in.', null));
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const { getUserById } = await import('../user/user.service');
  const user = await getUserById(req.user!.userId);
  res.json(new ApiResponse('Current user fetched', toPublicUser(user)));
});
