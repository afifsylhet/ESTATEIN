import type { Metadata } from 'next';
import Image from 'next/image';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <RegisterForm />
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop"
          alt="Bright modern interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-primary)]/30" />
      </div>
    </div>
  );
}
