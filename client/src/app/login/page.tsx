import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export const metadata: Metadata = { title: 'Log In' };

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <LoginForm />
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop"
          alt="Modern home exterior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/30" />
      </div>
    </div>
  );
}
