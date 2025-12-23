'use client';

import { ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import { SessionProvider, useSession } from 'next-auth/react';

function GuruShell({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={session?.user || {}} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GuruLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LoadingScreen />
      <GuruShell>{children}</GuruShell>
    </SessionProvider>
  );
}
