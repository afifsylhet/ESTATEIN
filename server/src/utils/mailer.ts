import nodemailer, { Transporter } from 'nodemailer';
import { env, isProd } from '../config/env';

let transporter: Transporter | null = null;

/** Whether SMTP credentials are present so email features can be enabled. */
export const isEmailConfigured = (): boolean => Boolean(env.EMAIL_USER && env.EMAIL_PASS);

function getTransporter(): Transporter {
  if (!transporter) {
    // Gmail SMTP. The password must be a Google "App Password" (not the account
    // password) generated from an account with 2-Step Verification enabled.
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
  }
  return transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error('Email is not configured (missing EMAIL_USER / EMAIL_PASS)');
  }
  const from = env.EMAIL_FROM || `Estatein <${env.EMAIL_USER}>`;
  await getTransporter().sendMail({ from, to, subject, html, text });
}

/** Branded HTML + plaintext for the password-reset email. */
export function buildPasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string; text: string } {
  const subject = 'Reset your Estatein password';
  const text =
    `Hi ${name},\n\n` +
    `We received a request to reset your Estatein password. ` +
    `Use the link below to choose a new one. This link expires in 1 hour.\n\n` +
    `${resetUrl}\n\n` +
    `If you didn't request this, you can safely ignore this email — your password won't change.`;

  const html = `
  <div style="margin:0;padding:24px;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f5132;padding:24px 32px;color:#ffffff;">
        <span style="font-size:20px;font-weight:700;letter-spacing:.3px;">Estatein</span>
      </div>
      <div style="padding:32px;color:#0f172a;">
        <h1 style="font-size:20px;margin:0 0 12px;">Reset your password</h1>
        <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 20px;">
          Hi ${name}, we received a request to reset the password for your Estatein account.
          Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#0f5132;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;">
          Reset Password
        </a>
        <p style="font-size:13px;line-height:1.6;color:#64748b;margin:24px 0 0;">
          Or paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="font-size:12px;line-height:1.6;color:#94a3b8;margin:0;">
          If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
        </p>
      </div>
    </div>
  </div>`;

  return { subject, html, text };
}

/** Verifies the SMTP connection at startup (dev only, best-effort logging). */
export async function verifyEmailConnection(): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    await getTransporter().verify();
    // eslint-disable-next-line no-console
    if (!isProd) console.log('✅ Email transport ready');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('⚠️  Email transport verification failed:', (err as Error).message);
  }
}
