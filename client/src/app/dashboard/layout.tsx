import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { DashboardSidebar } from '@/modules/dashboard/components/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="container-app flex gap-8 py-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 pb-16">{children}</div>
    </div>
  );
}
