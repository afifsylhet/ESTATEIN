'use client';

import * as React from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/modules/auth/hooks/useSession';
import { useUpdateProfile, useUpdateAvatar } from '../hooks/useUpdateProfile';
import { initials } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { toast } from '@/components/ui/toast';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export function ProfileForm() {
  const { user } = useSession();
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState(user?.name ?? '');
  const [phone, setPhone] = React.useState(user?.phone ?? '');

  if (!user) return null;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast({ title: 'Image too large', description: 'Please choose an image under 5MB.', variant: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    updateAvatar.mutate(formData);
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--muted)] text-xl font-semibold">
            {user.avatar?.url ? (
              <Image loader={cloudinaryLoader} src={user.avatar.url} alt={user.name} width={80} height={80} className="h-full w-full object-cover" />
            ) : (
              initials(user.name)
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
            aria-label="Change avatar"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile.mutate({ name, phone });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
        </div>
        <Button type="submit" loading={updateProfile.isPending}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
