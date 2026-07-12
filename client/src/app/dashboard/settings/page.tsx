import type { Metadata } from 'next';
import { PasswordForm } from '@/modules/user/components/PasswordForm';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Manage your account security.</p>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Change password</h2>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
