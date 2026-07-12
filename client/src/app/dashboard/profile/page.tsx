import type { Metadata } from 'next';
import { ProfileForm } from '@/modules/user/components/ProfileForm';

export const metadata: Metadata = { title: 'My Profile' };

export default function ProfilePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">My Profile</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">Update your personal information and photo.</p>
      <div className="mt-8">
        <ProfileForm />
      </div>
    </div>
  );
}
