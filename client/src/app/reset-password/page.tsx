import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPasswordPage() {
  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
