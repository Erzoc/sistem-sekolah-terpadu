import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SuperAdminHeader from './components/Header';
import SuperAdminSidebar from './components/Sidebar';

export const metadata = {
  title: 'SuperAdmin Dashboard - GuruPintar',
  description: 'Platform management & analytics',
};

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const userRole = (session.user as any)?.role;

  if (userRole !== 'superadmin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SuperAdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminHeader 
          user={{
            name: session.user?.name || 'SuperAdmin',
            email: session.user?.email || '',
            role: userRole,
          }}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
