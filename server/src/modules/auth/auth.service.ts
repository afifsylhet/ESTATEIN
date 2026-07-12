import crypto from 'crypto';
import { User, IUser } from '../user/user.model';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { generateTokenPair, generateAccessToken, verifyRefreshToken } from '../../utils/generateTokens';
import { sendEmail, buildPasswordResetEmail } from '../../utils/mailer';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** We store only a SHA-256 hash of the reset token, never the raw value. */
function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

async function issueTokensAndPersist(user: IUser) {
  const { accessToken, refreshToken } = generateTokenPair({
    userId: user.id,
    role: user.role,
  });

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await User.findOne({ email: data.email });

  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'user',
    provider: 'credentials',
  });

  const tokens = await issueTokensAndPersist(user);

  return {
    user,
    ...tokens,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');

  const genericError = () =>
    ApiError.unauthorized('Invalid email or password');

  if (!user || user.provider !== 'credentials') {
    throw genericError();
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    throw genericError();
  }

  const tokens = await issueTokensAndPersist(user);

  return {
    user,
    ...tokens,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.userId).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized(
      'Refresh token has been revoked. Please log in again.'
    );
  }

  // Deliberately non-rotating: we mint a fresh short-lived access token but keep
  // the existing refresh token. Server Components call this endpoint on every
  // render to resolve the session and cannot write a rotated cookie back to the
  // browser, so rotating here would desync the DB token from the browser cookie
  // and break the session on the next request.
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

/**
 * Kicks off a password reset: issues a single-use, time-limited token, persists
 * only its hash, and emails the raw token as a reset link. Silently no-ops for
 * unknown or non-credential accounts so we never leak which emails are registered.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email });
  if (!user || user.provider !== 'credentials') return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = hashResetToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  const resetUrl = `${env.CLIENT_URL.replace(/\/$/, '')}/reset-password?token=${rawToken}`;
  const { subject, html, text } = buildPasswordResetEmail(user.name, resetUrl);

  try {
    await sendEmail({ to: user.email, subject, html, text });
  } catch (err) {
    // Don't leave a dangling reset token if delivery failed.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw err;
  }
}

/**
 * Completes a password reset. Validates the token against its stored hash and
 * expiry, sets the new password (hashed by the model pre-save hook), and clears
 * the reset token plus any existing refresh token to log out other sessions.
 */
export async function resetPassword(rawToken: string, newPassword: string): Promise<void> {
  const user = await User.findOne({
    passwordResetToken: hashResetToken(rawToken),
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw ApiError.badRequest('This password reset link is invalid or has expired. Please request a new one.');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();
}

/**
 * Best-effort server-side revocation on logout. We decode the refresh token to
 * find the owner and clear the stored token so it can't be reused. Logout must
 * never fail because of an expired/invalid token — the caller always clears the
 * cookie regardless — so any error here is intentionally swallowed.
 */
export async function revokeRefreshToken(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(payload.userId, { $unset: { refreshToken: 1 } });
  } catch {
    // Token was missing, malformed, or expired — nothing to revoke server-side.
  }
}